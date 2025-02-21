import { useLocalStorage } from '@mantine/hooks'
import { download, generateCsv, mkConfig } from 'export-to-csv'
import { saveAs } from 'file-saver'
import React, { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { parseScan } from '../../util/parseScan'
import { DataSchema } from '../../util/dataSchema'

export default function Competition() {
    const { competition } = useParams()
    const [data, setData] = useLocalStorage({ key: competition, defaultValue: [] })
    const [scanData, setScanData] = useState()
    const formRef = useRef()
    const [editingData, setEditingData] = useState({})
    const [editing, setEditing] = useState(false)
    const [editingId, setEditingId] = useState(0)
    const [deleting, setDeleting] = useState(false)
    const [deletingId, setDeletingId] = useState(0)

    const handleSubmit = (e) => {
        e.preventDefault()
        formRef.current.reset()
        const actualData = parseScan(competition, scanData)
        setData(prevData => {
            if (prevData) {
                return [...prevData, actualData]
            } else {
                return [actualData]
            }
        })
    }

    const downloadCSV = () => {
        const csvConfig = mkConfig({
            fieldSeparator: ',',
            decimalSeparator: '.',
            useKeysAsHeaders: true,
            useBom: false,
            filename: `${competition}`
        })
        const csv = generateCsv(csvConfig)(data)
        download(csvConfig)(csv)
    }

    const downloadJSON = () => {
        const blob = new Blob([JSON.stringify(data)], { type: 'text/plain;charset=utf-8' })
        saveAs(blob, `${competition}.json`)
    }

    const enterDeleting = (id) => {
        setDeleting(true)
        setDeletingId(id)
    }

    const deleteEntry = () => {
        setData(prevData => {
            return prevData.filter(data => {
                return data.id != deletingId
            })
        })
        setDeleting(false)
    }

    const enterEditing = (id) => {
        const filtered = data.filter(d => {
            return d.id == id
        })[0]
        setEditingData(filtered)
        setEditingId(id)
        setEditing(true)
    }

    const saveEdit = () => {
        setData(prevData => {
            const index = prevData.findIndex(data => {
                return data.id == editingId
            })
            prevData[index] = editingData
            return prevData
        })
        setEditing(false)
    }

    const handleEditDataInput = (key, value) => {
        setEditingData(prev => DataSchema.parse({ ...prev, [key]: value }))
    }

    return (
        <>
            <div className={`modal ${editing ? 'd-block' : ''}`} aria-hidden={editing}>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <span className='h4'>{editingData.id}</span>
                        </div>
                        <div className='modal-body'>
                            {Object.keys(editingData).map(key => {
                                const value = key == 'startingPos' ? String(editingData[key]) : editingData[key]
                                return (
                                    <div key={key} className='d-flex flex-row align-items-baseline gap-3 mb-3'>
                                        <span>{key}:</span>
                                        <input
                                            type='text'
                                            className='form-control d-inline w-25'
                                            defaultValue={value}
                                            onChange={(e) => handleEditDataInput(key, e.target.value)}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                        <div className='modal-footer'>
                            <button className='btn btn-success' onClick={saveEdit}>Confirm</button>
                            <button className='btn btn-danger' onClick={() => setEditing(false)}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`modal ${deleting ? 'd-block' : ''}`} aria-labelledby='deleteModalLabel' aria-hidden={deleting}>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h1 className='modal-title fs-5' id='deleteModalLabel'>Confirm</h1>
                        </div>
                        <div className='modal-body'>
                            <p>Are you sure that you want to delete this entry?</p>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-success' onClick={deleteEntry}>Yes</button>
                            <button type='button' className='btn btn-danger' onClick={() => setDeleting(false)}>No</button>
                        </div>
                    </div>
                </div>
            </div>
            <Link to='/' className='m-1'>Home</Link>
            <h1 className='text-center mb-3'>{competition}</h1>
            <div className='card card-body mx-auto' style={{ maxWidth: 600 }}>
                <form onSubmit={handleSubmit} ref={formRef}>
                    <label htmlFor='exampleInputEmail1' className='form-label'>Scan:</label>
                    <input
                        type='text'
                        className='form-control'
                        id='competition-name'
                        aria-describedby='emailHelp'
                        onChange={e => setScanData(e.target.value)}
                    />
                    <button className='btn btn-primary mt-3 w-100' type='submit'>Enter</button>
                </form>
                <div className='mt-3'>
                    <div className='dropdown'>
                        <button className='btn btn-secondary dropdown-toggle' data-bs-toggle='dropdown' aria-expanded='false'> Download</button>
                        <ul className='dropdown-menu'>
                            <li className='dropdown-item' style={{ cursor: 'pointer' }} onClick={downloadCSV}>Download CSV</li>
                            <li className='dropdown-item' style={{ cursor: 'pointer' }} onClick={downloadJSON}>Download JSON</li>
                        </ul>
                    </div>
                </div>
            </div>
            {data && [...data].reverse().map((d, i) => {
                return (
                    <div className='card card-body mx-auto my-4' style={{ maxWidth: 600 }} key={i}>
                        <p>Team: {d.teamNum} | Name: {d.scoutName} | Match: {d.matchNum} </p>
                        <pre>{JSON.stringify(d)}</pre>
                        <div className='d-flex flex-row gap-2'>
                            <button className='btn btn-danger' style={{ width: 'fit-content' }} onClick={() => enterDeleting(d.id)}>Delete</button>
                            <button className='btn btn-info' onClick={() => enterEditing(d.id)}>Edit</button>
                        </div>
                    </div>
                )
            })}
        </>
    )
}
