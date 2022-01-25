import React,{useState,useEffect} from 'react'
import './WriteArticle.css'
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux'
import * as actionTypes from '../../store/actions/actions'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function WriteArticle(props){
    const [desc,setDesc] = useState("")
    const [imagePath, setImagePath]=useState("")
    const [image, setImage]=useState("")
    function imageUpload(e){
        if(e.target.value!==""){
            props.changePublishData({"articleImage": e.target.files[0]})
            setImage(URL.createObjectURL(e.target.files[0]))
            setImagePath(e.target.value)
        }
    }
    useEffect(()=>{
      if(props.location.state?props.location.state.post.coverImage:false){
        setImage(`https://free4store.blob.core.windows.net/blog-images/${props.location.state.post.coverImage}`)
      }
    },[props.location.state])
    return(
        <div className="wa-article-container">
        <div className="wa-article-body">
        <div className="wa-article-title-container">
        <InputLabel style={{textAlign: 'left',marginBottom: '10px',paddingLeft: '4px'}} htmlFor="filled-size-small">
          Title
        </InputLabel>
        <TextField
        autoFocus
          label=""
          id="filled-size-small"
          placeholder=""
          variant="filled"
          fullWidth
          onChange={(e)=>props.changePublishData({"title": e.target.value})}
          defaultValue={props.location.state?props.location.state.post.title:null}
        />
        <InputLabel style={{textAlign: 'left',marginTop: '20px',marginBottom: '10px',paddingLeft: '4px'}} htmlFor="filled-size-small">
          Author
        </InputLabel>
        <TextField
          label=""
          id="filled-size-small"
          placeholder=""
          variant="filled"
          fullWidth
          onChange={(e)=>props.changePublishData({"author": e.target.value})}
          defaultValue={props.location.state?props.location.state.post.author:null}
        />
        </div>
        <div className="wa-article-desc-container">
        <InputLabel style={{textAlign: 'left',marginBottom: '10px',paddingLeft: '4px',marginTop: '30px'}} htmlFor="filled-size-small">
        Description
        </InputLabel>
        {/* <TextField
          label=""
          id="filled-size-small"
          placeholder=""
          variant="filled"
          fullWidth
          multiline={true}
          rowsMax={15}
          rows={15}
          onChange={(e)=>props.changePublishData({"description": e.target.value})}
          defaultValue={props.location.state?props.location.state.post.description:null}
        /> */}
        <div className="wa-description-container"> 

        <CKEditor
          editor={ ClassicEditor }
          data={props.location.state?props.location.state.post.description:desc}
          onChange={ ( event, editor ) => {
              const data = editor.getData();
              setDesc(data)
              props.changePublishData({"description": data})
          } }
          config={
            {
              ckfinder:{
                uploadUrl: `https://proton-blog-server.herokuapp.com/upload/image`,
                headers: {"Access-Control-Allow-Origin": "*",
                'content-type': 'multipart/form-data'}
              }
            }
          }
          // onBlur={ ( event, editor ) => {
          //     console.log( 'Blur.', editor );
          // } }
          // onFocus={ ( event, editor ) => {
          //     console.log( 'Focus.', editor );
          // } }
          />
        </div>



        </div>
        <div className="wa-article-image-container">
            <div className="wa-article-image-fucntions">
                <div className="wa-article-image-button">
                        <Button variant="contained" component="label" size="small" style={{maxWidth:'65%',maxHeight: '60%',height:'30px',fontSize: '8px',width:'110px'}}>
                                Upload Cover Image
                                <input type="file" hidden onChange={(e)=>imageUpload(e)}/>
                        </Button>

                </div>
                <div>

                        <p className="wa-article-image-path"> {imagePath}</p>
                </div>
            </div>
            {(imagePath!=="" || (props.location.state?props.location.state.post.coverImage:false))?<div className="wa-article-up-image-container">
                <img src={image} alt="upload" className="wa-article-up-image"/>
            </div>:null}
        </div>
        <div className="wa-empty-space">

</div>
        </div>
        

        </div>
    )
}
const mapDispatchToProps = dispatch=>{
    return{
        changePublishData: (data)=> dispatch({type: actionTypes.SET_PUBLISH_DATA,data:data})
    }
}
export default connect(null,mapDispatchToProps)(WriteArticle)