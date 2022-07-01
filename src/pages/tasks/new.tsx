import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import {Button, Card, Form, Grid, Icon, Confirm} from 'semantic-ui-react'
import { Task } from 'src/interfaces/Task';
import { useRouter } from 'next/router'
import Layaout from 'src/components/Layout';

export default function newPage() {
  const router=useRouter();
  const [openConfirm, setOpenConfirm]= useState(false);
  const [task, setTask]= useState({
    title:'',
    description:'',
  })
  const handleChange=({target: {name, value},}:ChangeEvent<HTMLInputElement| HTMLTextAreaElement>)=>{
    setTask({...task, [name]:value})
  }
  const createTask=async (task: Task)=>{
    await fetch('http://localhost:3000/api/tasks',{
      method: 'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(task)
    })
  }
  const handleSubmit=async (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    try {
      if (typeof router.query.id === 'string') {
        updateTask(router.query.id,task)
      }else{
        await createTask(task);
      }
      
      router.push("/")
    } catch (error) {
      
    }
  }
  const loadTask = async (id:string)=>{
    const res=await fetch('http://localhost:3000/api/tasks/'+id)
    const task =await res.json()
    setTask({title: task.title, description: task.description})
  }
  const updateTask= async(id:string, task:Task)=>{
    await fetch("http://localhost:3000/api/tasks/"+id,{
      method: "PUT",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task)
    })
  }
  const hadleDelete= async(id:string)=>{
    try {
      await fetch("http://localhost:3000/api/tasks/"+id,{
      method: "DELETE"
    })
    router.push("/");
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    if (typeof router.query.id === 'string') {
      loadTask(router.query.id)
    }
  },[router.query])
  return (
    <Layaout>
      <Grid centered columns={3} verticalAlign="middle" style={{heigth:"70%"}}>
        <Grid.Column>
          <Card>
            <Card.Content>
              <Form onSubmit={handleSubmit}>
                <Form.Field>
                  <label htmlFor="title">Title:</label>
                  <input type="text"
                  placeholder="Write your title"
                  name="title" 
                  onChange={handleChange}               
                  value={task.title}
                  />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="description">Description:</label>
                  <textarea
                    name="description"
                    rows={2}
                    placeholder="Write a description"
                    onChange={handleChange}
                    value={task.description}>
                  </textarea>
                </Form.Field>
                {router.query.id ? (
                  <Button color='teal'>
                  <Icon name="save"/>Updating
                </Button>
                ):(
                <Button primary>
                  <Icon name="save"/>Save
                </Button>
                )
                }
              </Form>
            </Card.Content>
          </Card>
          {router.query.id && (
          <Button color='red' onClick={()=> setOpenConfirm(true)}>
            Delete
          </Button>)}
        </Grid.Column>
      </Grid>
      <Confirm
      header='Delete a task'
      content= {`Are you sure you want to delete this task ${router.query.id}`}
      open={openConfirm}
      onCancel={()=>setOpenConfirm(false)}
      onConfirm={()=> typeof router.query.id === "string" && hadleDelete(router.query.id)}
      />
    </Layaout>
  );
}
