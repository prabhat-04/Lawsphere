import React, { useState,useEffect } from "react";
import "./City.css";
import Swal from "sweetalert2";
import config from "./config";

const AddCity = () => {
  const [formData, setFormData] = useState({
    name: "",
    state: "",
  });

    const { name, state } = formData;
    const [stateList, setstateList] = useState([]);
  
    useEffect(() => {
      // Fetch state list on component mount
      const fetchCountries = async () => {
        try {
          const response = await fetch(
            `${config.url}/lawsphere-api/v1/admin_settings/state/`
          );
  
          if (response.ok) {
            const stateData = await response.json();
            setstateList(stateData.results);
          } else {
            console.error("Failed to fetch state list");
          }
        } catch (error) {
          console.error("Error fetching state list:", error);
        }
      };
  
      fetchCountries();
    }, []);
  
    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
    
  
    const handleSubmit = async () => {
      if (name === "" || state === "") {
        Swal.fire({
          title: "Input Fields are Empty!",
          allowOutsideClick: () => {
            const popup = Swal.getPopup();
            popup.classList.remove("swal2-show");
            setTimeout(() => {
              popup.classList.add("animate_animated", "animate_headShake");
            });
            setTimeout(() => {
              popup.classList.remove("animate_animated", "animate_headShake");
            }, 500);
            return;
          },
        });
        return;
      }
  
      try {
        const response = await fetch(
          `${config.url}/lawsphere-api/v1/admin_settings/city/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access")}`
            },
            body: JSON.stringify(formData),
          }
        );
  
        if (!response.ok) {
          if (
            response.headers.get("content-type")?.includes("application/json")
          ) {
            response.json().then((responseData) => {
              // console.log(responseData);
              Swal.fire({
                icon: "error",
                title: "State Addition Failed!",
                text:
                  responseData.detail ||
                  responseData.error ||
                  "Unknown error occurred",
              });
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "state Creation Failed!",
              text: "An error occurred during adding state. Please try again later.",
            });
          }
        } else {
          if (
            response.headers.get("content-type")?.includes("application/json")
          ) {
            response.json().then((responseData) => {
              // console.log(responseData);
              Swal.fire({
                icon: "success",
                title: "city Added Successfully!",
                text: responseData.detail,
                showConfirmButton: false,
                timer: 1500,
              });
            });
          }
          Swal.fire({
            icon: "success",
            title: `Response: ${JSON.stringify(response)}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        // Handle any unexpected errors
        // console.error("Error during signup:", error);
        Swal.fire({
          icon: "error",
          title: "An unexpected error occurred!",
          text: "Please try again later.",
        });
      }
    };
  
    return (
      <div className="container">
        <div className="position-absolute top-50 start-50 translate-middle">
          <div className=" shadow p-5 mb-5 bg-body-tertiary rounded">
            <form action="#" method="post" className="state">
              <h2 className="title">Add City</h2>
              <div className="input-field">
                <i className="fas fa-globe"></i>
                <select
                  name="state"
                  value={state}
                  onChange={handleInputChange}
                  style={{backgroundColor: '#f0f0f0',
                    border: 'none',
                    borderRadius: '15px'}}
                >
                  <option value="" disabled>
                    Select State
                  </option>
                  {stateList.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  type="text"
                  name="name"
                  value={name}
                  placeholder="City Name"
                  onChange={handleInputChange}
                />
              </div>
              <button type="button" className="btn_state" onClick={handleSubmit}>
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };
export default AddCity;
