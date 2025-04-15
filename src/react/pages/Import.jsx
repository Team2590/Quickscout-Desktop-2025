import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Import() {
    const [competitionName, setCompetitionName] = useState('')
    const [data, setData] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (competitionName && data) {
            localStorage.setItem(competitionName, data)
            navigate(`/competitions/${competitionName}`)
        } else {
            alert('Please provide a name and valid data.')
        }
    }

    const isSubmitDisabled = () => {
        return !competitionName || !data
    }

    const handleUpload = (e) => {
        const file = e.target.files[0]

        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    setData(e.target.result)
                    alert('Data successfully uploaded')
                } catch (e) {
                    alert('Error uploading data')
                }
            }
            reader.readAsText(file)
        }
    }

    return (
        <>
            <Link to='/' className='m-1'>Home</Link>
            <form className='card card-body mx-auto' style={{ width: 400, marginTop: '22%' }} onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor='formFile' className='form-label' style={{ marginBottom: 4 }}>Select JSON File:</label>
                    <input className='form-control' type='file' id='formFile' onChange={handleUpload} accept=".json" />
                </div>

                <div className="mb-1 mt-2">
                    <label htmlFor="Competition" className="form-label" style={{ marginBottom: 4 }}>Competition Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="Competition"
                        onChange={e => setCompetitionName(e.target.value)}
                        value={competitionName}
                    />
                </div>

                <button className='btn btn-primary mt-3' type='submit' disabled={isSubmitDisabled()}>
                    Submit
                </button>
            </form>
        </>
    )
}
