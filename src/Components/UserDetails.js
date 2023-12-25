//** component to show user detail and posts of user */

import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import urls from '../url';
import moment from "moment-timezone";
import './UserList.css'

function UserDetails() {

    const { state } = useLocation();
    const [countryList, setCountryList] = useState([])
    const [error, setError] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [showTime, setShowTime] = useState(null);
    const [clockRunning, setClockRunning] = useState(true);
    const userDetails = state?.userDetails || {};
    const postData = state?.postData || {};

    // Function to handle the dropdown item click
    const handleDropdownChange = async (event) => {
        setSelectedCountry(event.target.value);
        const response = await fetch(`${urls.timeUrl}${event.target.value}`);
        const data = await response.json();
        setShowTime(moment(data.unixtime, "X").tz(data.timezone).format('HH:mm:ss'));
    };

    //** useEfect to call API to get country list */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const countryResponse = await fetch(urls.countryUrl)

                if (!countryResponse.ok) {
                    throw new Error(`HTTP error for users API! Status: ${countryResponse.status}`);
                }
                const countries = await countryResponse.json();

                setCountryList(countries);

            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Update the time every second if the clock is running
        if (showTime !== null && clockRunning) {
            const intervalId = setInterval(() => {
                setShowTime(moment(showTime, "HH:mm:ss").add(1, "s").format("HH:mm:ss"))
            }, 1000);

            // Clean up the interval when the component is unmounted
            return () => clearInterval(intervalId);
        }

    }, [clockRunning, showTime]);

    const toggleClock = () => {
        setClockRunning((prevRunning) => !prevRunning);
    };

    return (
        <>
            <div className="top-bar">
                {/* Back button on top right */}
                <Link to="/">Back</Link>

                {/* Dropdown in top left */}
                <div className="dropdown">
                    <select value={selectedCountry} onChange={handleDropdownChange}>
                        <option value="" disabled>Select Country</option>
                        {countryList.map((country) => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Digital clock and start/pause buttons on the right */}
                <div className="clock">
                    <p>{showTime ? showTime : "00:00:00"}</p>
                </div>
                <div className="clock-buttons">
                    <button onClick={toggleClock}>{clockRunning ? 'Pause' : 'Start'}</button>
                </div>

            </div>

            {/* User digital to show profile data */}
            <h4>Profile Page</h4>
            <div className="clickable-card">
                <div className="user-info">
                    <p>{userDetails.name}</p>
                    <p>{`${userDetails.address.suite}, ${userDetails.address.street}, ${userDetails.address.zipcode}, ${userDetails.address.city}`}</p>
                </div>
                <div className="user-info">
                    <p>{`${userDetails.username} | ${userDetails.company.catchPhrase}`}</p>
                    <p>{`${userDetails.email} | ${userDetails.phone}`}</p>
                </div>
            </div>

            {/* Card to show posts of user */}
            <div className='post-component'>
                {postData ? postData.map((post) =>
                    <div className="post-card">
                        <div className="card-content">
                            <h5>{post.title}</h5>
                            <p>{post.body}</p>
                        </div>
                    </div>
                )
                    : null}

            </div>
        </>
    );
}

export default UserDetails