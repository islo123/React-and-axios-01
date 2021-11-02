import './App.css';
import axios from "axios"
import { useEffect, useState } from 'react';
import React from "react"

function App() {
  const [data, setData] = useState([])
  const [value, setValue] = useState(0)
  const [isLoading, setIsLoading]= useState(true)
  const [inputText, setInputText] = useState("")

  const api = axios.create({
      baseURL: "http://localhost:3001/api/v1/tasks"
  })
  


  const checkNumber = function (number){
    if(number > data.length - 1){
      return 0
    }if(number < 0){
      return data.length - 1
    }
    return number;
  }
  
  const onPageOpen = async function (){
   
        
        api.get("/").then(function(res){
          setData(res.data.tasks)
          setIsLoading(false)
        }).catch(function(error){
        console.log(error)
        })
    }

    useEffect(function(){
      onPageOpen()
    })

    const makePost = async function(e){
      e.preventDefault()
      let res = await api.post("/", {name: inputText})
      if(inputText){
          setData(function(data){
          return [...data, res.data]
      }) 
      setInputText("")
      }

    }

    const deleteTask = async function(_id){
            await api.delete(`/${_id}`)
            const filter = data.filter(function(item){
            return item._id !== _id
            })
            setData(filter)

        
    }

    const updateTask =async function(_id){
        let res = await api.patch(`/${_id}`, {name: inputText})
        if(inputText){
          setData(function(){
            return [...data, res.data]
          })
        }
        setInputText("")
        
    }

    //IF FUNKTIO PITÄ OLLA JOTTA data[value] TOIMI
    if(isLoading){
      return (
        <div>
          <h3>Loading...</h3>
        </div>
      )
    }
   const {name, _id}= data[value]
   return (
    <div className="App">
      <h3>Minun mongoDB tietokanta tulokset</h3>
      <h3>{name}</h3>
      <h3>{_id}</h3>
      <button onClick={function(){return deleteTask(_id)}}>Delete task from database</button>
      <button onClick={function(){setValue(checkNumber(value - 1))}}>Prev</button>
      <button onClick={function(){setValue(checkNumber(value + 1))}}>Next</button>
      <button onClick={function(){return updateTask(_id)}}>Edit</button>

      <br/>
      <br/>
      <div>
        <form>
          <input value={inputText} onChange={function(e){return setInputText(e.target.value)}}/>
          <button style={{margin: "1rem"}} onClick={makePost}>Post</button>

        </form>
        {data.map(function(item){
          return (
            <div key={item._id}>
              <h3>{item.name}</h3>
              <button onClick={function(){return deleteTask(item._id)}}>Delete task from database</button>
              <button onClick={function(){return updateTask(item._id)}}>Edit</button>

            </div>
          )
        })}
      </div>

    </div>
  );
}

export default App;
