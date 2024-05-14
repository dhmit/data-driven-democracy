import React from "react";
import "../scss/home.scss";
import homepage_pic from "./homepage_pic.jpg";

const Home = () => {
    return (
        <div id="main-content">
            <div className="text-block">
                <h1>Data Driven Democracy</h1>
                <p>Spring 2024 Cohort</p>
                <p>
                    Mapping India's 2024 Elections "Data-Driven Democracy" is a project designed to
                    illuminate the complexities of India's electoral process through the lens of
                    digital humanities, aligning closely with the DH goals of interdisciplinary
                    research and innovative public scholarship. At the heart of this initiative is a
                    collaboration between MIT's UROP students and Indian journalists, aimed at
                    developing a dynamic website that presents real-time election data, opinion
                    polls, and demographic analyses in an accessible, visual format. This project
                    not only seeks to demystify the vast electoral landscape of the world's largest
                    democracy but also to engage UROP students in the practical application of
                    digital tools and methodologies in social sciences research. By integrating data
                    visualization, statistical analysis, and digital mapping, students will gain
                    hands-on experience in translating complex datasets into compelling,
                    user-friendly narratives.
                </p>
                <p>
                    This website contains sample mapping and graphical depictions of data from 
                    three different datasources from the Ashoka University Trivedi Centre for
                    Political Data, the Election Commission of India, and the Lokniti: Programme
                    for Competitive Democracy.
                </p>
            </div>
            <div className="image-block">
                <img src={homepage_pic} alt="Data Driven Democracy Image" />
            </div>
        </div>
    );
};

export default Home;
