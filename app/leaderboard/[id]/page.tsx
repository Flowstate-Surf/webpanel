'use client'
import { useParams } from 'next/navigation'

const PlayerPage = () => {
    const params = useParams();
    const id = params.id;

    return (
        <div className='min-h-screen bg-gray-900 text-white p-6'>
            <h1 className="text-3x1 font-bold mb-4"> Player Details {id} </h1>
            <p>foo bar</p>
        </div>
    )
}

export default PlayerPage