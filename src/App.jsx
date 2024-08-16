import { useState, useEffect } from "react";
import Footer from "./Footer";

export default function App() {
  const api = import.meta.env.VITE_REACT_API_INFO;
  const [infos, setInfo] = useState([]);
  const [inputName, setInputName] = useState("");
  const [inputAge, setInputAge] = useState("");
  const [InputFile, setInputFile] = useState("");

  const [mount,setMount] = useState(null);

  const clearFields = () =>{
    setInputName(inputName=>"");
    setInputAge(inputAge=>"");
    setInputFile(InputFile=>"");
  }

  useEffect(() => {
    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setInfo((infos) => data);
      })
      .catch((error) => console.log("Error", error));
  }, [mount]);

  const handleName = (e) => {
    setInputName((inputName) => e.target.value);
  };

  const handleAge = (e) => {
    setInputAge((inputAge) => e.target.value);
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setInputFile((InputFile) => base64);
    console.log(base64);
  };

  // Function to convert file to base64 string
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(InputFile);

    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: inputName,
        age: inputAge,
        image: InputFile,
      }),
    })
      .then((response) => {
        response.json()
        if(response.ok){
          setMount(mount=>"Submited");
          clearFields();
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  //Handling Deleting characters
  const deleteCharacter = (e) => {
    const id = e.target.value;
    console.log(id);

    fetch(`${api}/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        response.json()
          if(response.ok){
            setMount(mount=>"Deleted")
          }
      })
      .then((data) => console.log(data));
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center">Simple Web App</h1>
      <form className="form-control" onSubmit={handleSubmit}>
        <input
          value={inputName}
          onChange={handleName}
          className="form-control"
          placeholder="Enter Name"
          type="text"
        />
        <br />
        <input
          value={inputAge}
          onChange={handleAge}
          className="form-control"
          placeholder="Enter Age"
          type="Number"
        />
        <br />
        <label>Select Image</label>
        <input
          onChange={handleFile}
          className="form-control"
          required
          type="file"
        />
        <br />
        <div className="d-grid">
          <button className="btn btn-success" type="submit">
            Upload &nbsp;
            <i className="fa-solid fa-globe" style={{color: "#ffffff"}}></i>
          </button>
        </div>
      </form>
      <br />
      <div>
        {infos.map((info) => (
          <div key={info._id}>
            <div className="card" style={{ padding: "15px" }}>
              <img src={info.image} alt="image" className="img-fluid" />
              <h5>Name: {info.name}</h5>
              <p>Age: {info.age}</p>
              <div className="text-center">
                <button
                  className="btn btn-danger"
                  value={info._id}
                  onClick={deleteCharacter}
                >
                  Remove{" "}
                  <i
                    className="fa-solid fa-trash-can"
                    style={{ color: "#fafafa" }}
                  ></i>
                </button>
              </div>
            </div>
            <br />
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
