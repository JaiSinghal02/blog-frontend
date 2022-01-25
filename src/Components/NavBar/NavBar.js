import React,{useState,useEffect} from 'react'
import Button from '@material-ui/core/Button';
import {NavLink} from 'react-router-dom'
import {withRouter} from 'react-router-dom'
import SideDrawer from '../UI/SideDrawer/SideDrawer'
import './NavBar.css'
import axios from 'axios';

function NavBar(props){
    const userName=localStorage.getItem("first_name")
    const path=props.history.location.pathname
    const boolWriteBar=path==="/writearticle"
    let navlist=[{"name":"BLOG","path":"/landingpage"},{"name":"LOGIN","path":"/authentication"}]
    if(props.isLogged){
        navlist.splice(1,1);
        navlist.push({"name":"LOGOUT","path":"/"})
    }
    if(props.isLogged && props.isAdmin){
        navlist=[{"name":"WRITE","path":"/writearticle"},{"name":"YOUR ARTICLE","path":"/yourarticles"},{"name":"BLOG","path":"/landingpage"},{"name":"LOGOUT","path":"/authentication"}]
        if(boolWriteBar){
            navlist.splice(0,1)
        }
    }
    const [publishBar,setWriteBar]=useState(false)
    
    useEffect(()=>{
        if(publishBar){
            axios.get('/api/article/nopublish')
            .then()
            .catch(err=>{
                console.log(err.message)
            })
            props.clearPublishData()
            console.log("Publish data cleared")
        }
        setWriteBar(boolWriteBar)
        
        
    },[path])
    function publishArticle(){
        setWriteBar(false)
        props.publishArticle();
    }
    let nav1= <>
    <NavLink activeClassName="active-link" exact to="/landingpage" style={{ textDecoration: 'none' }}>
    <Button variant="outlined" classes={{root:"navbar-button",label: "navbar-button-label"}} style={{marginRight: '8px',padding: '4px 5px'}} >Blog</Button>
    </NavLink>
    {props.isLogged?
    <NavLink exact to="/" style={{ textDecoration: 'none' }}>
    <Button onClick={()=>props.logout()}classes={{root:"navbar-button",label: "navbar-button-label"}} style={{padding: '4px 5px'}} >Logout</Button>
    </NavLink>:
    <NavLink exact to="/authentication" style={{ textDecoration: 'none' }}>
    <Button onClick={()=>{localStorage.clear()}}classes={{root:"navbar-button",label: "navbar-button-label"}} style={{padding: '4px 5px'}} >Login</Button>
    </NavLink>
    }</>
    let nav2=null;
    if(props.isAdmin){
        nav2=<>
{publishBar?
                    <Button variant="outlined" onClick={()=>publishArticle()}classes={{root:"navbar-button",label: "navbar-button-label"}} style={{marginRight: '8px',padding: '4px 5px',backgroundColor: '#6e81eb',color:'white'}} >Publish</Button>
                    :
                    <NavLink activeClassName="active-link" to="/writearticle" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" classes={{root:"navbar-button",label: "navbar-button-label"}} style={{marginRight: '8px',padding: '4px 5px'}} >Write</Button>
                    </NavLink>
                    }
                    <NavLink activeClassName="active-link" exact to="/yourarticles" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" classes={{root:"navbar-button",label: "navbar-button-label"}} style={{marginRight: '8px',padding: '4px 5px'}} >Your Article</Button>
                    </NavLink>
        </>
    }
    return(
        <div className="navbar-container">
            <div className="navbar-info">
                <h2>ProtonAutoML | {userName?`Welcome ${userName}${props.isAdmin?` (${props.isAdmin?"Admin":""})`:""},`:"Own Your Data"}</h2>
            </div>
            {/* secondary publish button for mobile device */}
            <div className="navbar-secondary-publish-button"> 
            {publishBar?
                    <Button variant="outlined" onClick={()=>publishArticle()}classes={{label: "navbar-button-label"}} style={{marginRight: '8px',padding: '4px 5px',backgroundColor: '#6e81eb',color:'white'}} >Publish</Button>
                    :null }
            </div>
            
            <div className="navbar-buttons-container">
                <div className="navbar-sidedrawer">
                    <SideDrawer logout={props.logout}list={navlist}/>
                </div>
                <div className="navbar-buttons-div">
                    
                    {nav2}
                    {nav1}
                   
                </div>
            </div>
        </div>
    )
}

export default withRouter(NavBar)