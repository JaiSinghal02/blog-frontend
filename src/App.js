import './App.css';
import {useState,useEffect} from 'react'
import {withRouter,Route,Switch,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import * as actionTypes from './store/actions/actions'
import Auth from './Components/Auth/AuthForm'
import LandingPage from './Components/LandingPage/LandingPage'
import NavBar from './Components/NavBar/NavBar'
import WriteArticle from './Components/WriteArticle/WriteArticle'
import YourArticles from './Components/YourArticles/YourArticles'
import ViewArticle from './Components/ViewArticle/ViewArticle'
import PopUp from './Components/UI/PopUp/PopUp'
import axios from 'axios';

function App(props) {
  const [popup, changePopUp] = useState({ message: "", severity: "" })
  const token= localStorage.getItem("token")
  axios.defaults.headers.common['x-auth-token'] = token;
  function publishArticle(){
    const data=props.publishData
    let form = new FormData()
    Object.keys(data).forEach(d=>{
      form.append(d,data[d])
    })
    console.log("POSTING->",data["description"])
    if(data["title"] !=="" && data["description"]!==""){
      props.history.push('/landingpage')
      let url="publish"
      let msg="Published Successfully"
      if(props.isEditing){
        url=`update/${props.articleId}`
        msg="Updated Successfully"
        console.log("Updating with\n",data)
        props.toggleEditing();
      }
      
      axios.post(`/api/article/${url}`,form,{
        headers:{
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res=>{
        changePopUp(prev => ({ ...prev, message: msg, severity: "success" }))
      })
      .catch(err=>{
        changePopUp(prev => ({ ...prev, message: `${err.message?err.message:"Some error occured"}`, severity: "error" }))
        console.log(err.message)
      })
    }
    else{
      changePopUp(prev => ({ ...prev, message: `Cannot publish incomplete article`, severity: "error" }))
    }
  }
  useEffect(()=>{
    axios.get('/admincheck')
    .then(res=>{
      props.setAdminAccess(res.data)
    })
    .catch((err)=>{
      console.log(err)
    })
  },[])
  function logout(){
    localStorage.clear();
    console.log("Setting Admin to false")
    props.setAdminAccess(false)

  }
  let navbar=null
  let showPopUp = null;
  if (popup["message"] !== "") {
    showPopUp = <PopUp severity={popup["severity"]} open={true} message={popup["message"]} timer="2000" />
    setTimeout(() => {
      changePopUp(prev => ({ ...prev, message: "", severity: "" }))
    }, 2000)
  }
    navbar=<NavBar logout={logout}isLogged={token?true:false} isAdmin={props.isAdmin} publishArticle={publishArticle} clearPublishData={props.clearPublishData}></NavBar>
    let route;
    if(props.isAdmin){
    route=<Switch>
    <Route path="/viewarticle" component={ViewArticle} />
    <Route path="/yourarticles" component={YourArticles} />
    <Route path="/writearticle" component={WriteArticle} />
    <Route path="/landingpage" component={LandingPage} />
    <Redirect to="/"/>
  </Switch>
    }
    else{
      route=<Switch>
        {!token?<Route path="/authentication" component={Auth} />:null}
    <Route path="/viewarticle" component={ViewArticle} />
    <Route path="/landingpage" component={LandingPage} />
    <Redirect to="/"/>
  </Switch>
    }
  
  return (
    <div className="App">
      <header className="App-header">
        {navbar}
        {route}
      </header>
      {showPopUp}
    </div>
  );
}
const mapStateToProps = state=>{
  return{
    publishData: state.publishData,
    isEditing: state.isEditing,
    articleId: state.articleId,
    isAdmin: state.isAdmin
  }
}
const mapDispatchToProps = dispatch=>{
  return{
    clearPublishData: ()=> dispatch({type: actionTypes.UNSET_PUBLISH_DATA}),
    toggleEditing: ()=> dispatch({type: actionTypes.TOGGLE_EDITING}),
    setAdminAccess: (adminAccess)=> dispatch({type: actionTypes.SET_ADMIN_ACCESS,adminAccess:adminAccess})
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(App));
