import React,{useState,useEffect} from 'react'
import './YourArticles.css'
import YourArticle from './YourArticle/YourArticle'
import Stepper from '../UI/Stepper/Stepper'
import Modal from '../UI/Modal/Modal'
import PopUp from '../UI/PopUp/PopUp'
import axios from 'axios'
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions/actions'


function YourArticles(props) {
    const [stepValue,setStepValue]=useState(0)
    const [userArticle,setUserArticle]=useState([])
    const [deleting,setDeleting]=useState({isDeleting:false,articelIndex: null})
    const [popup, changePopUp] = useState({ message: "", severity: "" })
    function stepperClick(i){
        setStepValue(i)
    }
    
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
      }, [stepValue])
      useEffect(()=>{
        axios.get('/api/article/user')
        .then(res=>{
            setUserArticle(res.data)
        })
        .catch(err=>{
            console.log(err)
        })
      },[popup.message])
      let receivedData=[]
      for(let i=0;i<15;i++){
          receivedData.push({'user': `user-${i+1}`,'title': `title-${i+1}`,'description': `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`})
      }
      let data=[]
      const start=stepValue*5
      const end=Math.min(start+5,userArticle.length)
      for(let j=start;j<end;++j){
          data.push(userArticle[j])
      }
      function articleClicked(i){
          let pos=stepValue*5+i
          localStorage.setItem("articleId",userArticle[pos]["_id"])
        props.history.push('/viewarticle')
    }
    function editArticle(i){
        let pos=stepValue*5+i;
        props.toggleEditing(userArticle[pos]["_id"]);
        props.setEditingData(userArticle[pos])
        props.history.push({
            pathname:'/writearticle',
            state: {post: userArticle[pos]}
        })
    }
    function deleteArticle(){
        let pos=stepValue*5+deleting.articelIndex;
        axios.delete(`/api/article/delete/${userArticle[pos]["_id"]}`)
         .then(res=>{
            changePopUp({message: "Article deleted successfully", severity: "success" })
         })
         .catch(err=>{
             changePopUp({message: `${err.message?err.message:"Some error occured"}`, severity: "error" })
             console.log(err)
         })
         setDeleting({isDeleting:false,articelIndex:null})
    }
    let showPopUp=null
    if (popup["message"] !== "") {
        showPopUp = <PopUp severity={popup["severity"]} open={true} message={popup["message"]} timer="2000" />
        setTimeout(() => {
          changePopUp({message: "", severity: "" })
        }, 2000)
    }
    let noArticle=<p style={{marginTop: '50px',fontSize: '20px'}}>No Article Submitted Yet</p>
    if(userArticle.length){
        noArticle=null
    }
    return (
        <>
        {deleting.isDeleting?
        <Modal cancel={()=>setDeleting({isDeleting:false,articelIndex:null})}
        content="Are you sure you wish to delete the article ?" 
        toggle={deleting.isDeleting} 
        proceed={deleteArticle}/>
        :null
        }
        <div className="ya-container">
            <div className="ya-body">
                <div className="ya-head">
                    <div  className="ya-head-body">
                        <div className="ya-head-line"><hr></hr></div>
                        <div className="ya-head-tag">
                            <h4>Your Submitted Articles</h4>
                        </div>
                        <div className="ya-head-line"><hr></hr></div>
                    </div>
                </div>

                <div className="ya-article-container">
                    <div className="ya-article-body">
                        {noArticle}
                        <YourArticle editArticle={(i)=>editArticle(i)} deleteArticle={(i)=>setDeleting({isDeleting:true,articelIndex:i})} data={data} articleNumber={stepValue} articleClicked={(i)=>articleClicked(i)}/>
                    </div>
                </div>
            </div>
        </div>
        <div className="ya-footer">
        {userArticle.length>5?
        <Stepper length={userArticle.length} divider={5} stepperClick={stepperClick}/>:null
        }
        </div>
        {showPopUp}
        </>
    )
}
const mapStateoProps = state =>{
    return{
        publishData: state.publishData
    }
}
const mapDispatchToProps = dispatch =>{
    return{
        toggleEditing: (id)=>dispatch({type: actionTypes.TOGGLE_EDITING,id:id}),
        setEditingData: (articleData)=>dispatch({type: actionTypes.SET_EDITING_DATA, articleData:articleData})
    }
}

export default connect(mapStateoProps,mapDispatchToProps)(YourArticles)