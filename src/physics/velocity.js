
import { Chart, LinearScale, LineController, LineElement, PointElement, CategoryScale } from 'chart.js';
export class VelocityChart {
    velocityData;
    timeData;
    chart;
    constructor() {
        // Register the necessary components for Chart.js
        Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);

        const ctx = (document.getElementById('velocityChart'));
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.timeData,
                datasets: [{
                    label: 'Velocity Over Time',
                    data: this.velocityData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Time (s)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Velocity (m/s)'
                        }
                    }
                }
            }
        });
        this.updateVelocityDisplay(0);
    }
    updateChart(time, velocity) {
        this.timeData.push(time);
        this.velocityData.push(velocity);
        this.chart.update();
    }
    updateVelocityDisplay(velocity) {
        const velocityDisplay = document.getElementById('velocityDisplay');
        velocityDisplay.innerText = `Velocity: ${velocity.toFixed(2)} m/s`;
    }
}