import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const ProgressChart = ({ progress }) => {
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;

    if (Array.isArray(progress)) {
        completed = progress.filter(p => p.overall_progress === 100).length;
        inProgress = progress.filter(p => p.overall_progress > 0 && p.overall_progress < 100).length;
        notStarted = progress.filter(p => p.overall_progress === 0).length;
    } else if (progress && typeof progress === 'object') {
        completed = progress.completed || 0;
        inProgress = progress.inProgress || 0;
        notStarted = progress.notStarted || 0;
    }

    const data = {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [
            {
                data: [completed, inProgress, notStarted],
                backgroundColor: ['#10B981', '#3B82F6', '#9CA3AF'],
                borderWidth: 1,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    }

    return (
        <div className="w-64 h-64 mx-auto">
            <Doughnut data={data} options={options} />
        </div>
    )
}

export default ProgressChart