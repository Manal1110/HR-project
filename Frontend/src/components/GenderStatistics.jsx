import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
    font-family: Arial, sans-serif;
`;

const ChartAndImagesContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1200px; // Adjust max-width as needed
`;

const ChartContainer = styled.div`
    width: 60%;
    max-width: 600px;
`;

const ImageContainer = styled.div`
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 20px;
`;

const StatItem = styled.p`
    font-size: 1.2em;
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: flex-start; // Ensure the items are aligned to the start
`;

const FigureImage = styled.img`
    width: 40px;
    height: 40px;
    margin-left: 10px; // Margin on the left if the image is after the text
`;

const GenderStatistics = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:3500/gender/gender-stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching gender statistics:', error);
            }
        };

        fetchStats();
    }, []);

    if (!stats) return <Container>Loading...</Container>;

    const total = stats.maleCount + stats.femaleCount + stats.otherCount;
    const malePercentage = ((stats.maleCount / total) * 100).toFixed(2);
    const femalePercentage = ((stats.femaleCount / total) * 100).toFixed(2);

    const data = [
        { name: 'Male', value: stats.maleCount },
        { name: 'Female', value: stats.femaleCount },
    ];

    return (
        <Container>
            <h2>Gender Statistics</h2>
            <ChartAndImagesContainer>
                <ChartContainer>
                    <PieChart width={600} height={400}>
                        <Pie
                            data={data}
                            dataKey="value"
                            outerRadius={150}
                            fill="#8884d8"
                            label
                        >
                            <Cell key="male" fill="#0088FE" />
                            <Cell key="female" fill="#FF69B4" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ChartContainer>
                <ImageContainer>
                    <StatItem>
                        Male Count: {stats.maleCount} ({malePercentage}%)
                    </StatItem>
                    <StatItem>
                        Female Count: {stats.femaleCount} ({femalePercentage}%)
                    </StatItem>
                </ImageContainer>
            </ChartAndImagesContainer>
        </Container>
    );
};

export default GenderStatistics;
