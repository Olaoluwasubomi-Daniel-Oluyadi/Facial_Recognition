import { useState } from 'react';
import './App.css';
const uuid = require('uuid');

function App() {
  const [image, setImage] = useState('')
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to authenticate')

  const [visitorName, setVisitorName] = useState('placeholder.jpeg')
  const [isAuth, setAuth] = useState(false);

  function sendImage(e){
    e.preventDefault();
    setVisitorName(image.name)
    const visitorImageName = uuid.v4();
    fetch(`https://to6whbgmmh.execute-api.ca-central-1.amazonaws.com/dev/subomi-vistor-images/${visitorImageName}.jpg`, {
      method:'PUT',
      headers:{
        'Content-Type':'image/jpeg'
      },
      body: image
    }).then(async () => {
       const response = await authenticate(visitorImageName);
       if (response.Message ==='Success'){
        setAuth(true);
        setUploadResultMessage(`Hi ${response['lastName']}, welcome to work hope you have a productive day today`)
       }else{
        setUploadResultMessage('Authentication Failed: this person is not an employe')
       }
    }).catch(error=> {
      setAuth(false)
      setUploadResultMessage('There is an error during the authentication process. Please try again')
    })
  }

  async function authenticate(visitorImageName){
    const requestUrl = 'https://to6whbgmmh.execute-api.ca-central-1.amazonaws.com/dev'+ new URLSearchParams({
      objectKey: `${visitorImageName}.jpg`
    });
    return await fetch(requestUrl,{
      method:'GET',
       headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
       }
    }).then(response=> response.json()).then((data)=> {
      return data;
    }).catch(error=>console.error(error))
  }

  return (
    <div className="App">
     hello
     <h2>Employee Facial Recognition System</h2>
     <form onSubmit = {sendImage}> 
      <input type = 'file' name = 'image' onChange={e=>setImage(e.target.files[0])}/> 
      <button type='submit'>Authenticate </button>
     </form>
     <div className= {isAuth ?'success':'failure'}>{uploadResultMessage }</div>
     <img src={require(`./visitors/${visitorName}`)} alt= "Visitor" height={250} width={250}></img>
    </div>
  );
}

export default App;
