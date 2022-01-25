import React,{useState} from 'react'
import './LatestArticles.css'
import Image from '../../image.png'
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import {connect} from 'react-redux'
import * as actionTypes from '../../store/actions/actions'
import {withRouter} from 'react-router-dom'
import parse from 'html-react-parser';
import axios from 'axios'

function LatestArticles(props){
    const [likedHeart,setLikedHeart]=useState(Array(props.data.length).fill(false))
    const toggleHeart=(index)=>{
        if(!likedHeart[index]){
            axios.post('/api/article/like',{ _id: props.data[index]["_id"]})
            .then(res=>{})
            .catch(err=>{})
        }
        else{
            axios.post('/api/article/dislike',{ _id: props.data[index]["_id"]})
            .then(res=>{})
            .catch(err=>{})
        }
        let arr=[...likedHeart]
        arr[index]=!arr[index]
        setLikedHeart(arr)
    }
    let articles=props.data.map((article,index)=>{
        let img=Image
        if(article["coverImage"]){
            img=`https://free4store.blob.core.windows.net/blog-images/${article["coverImage"]}`
        }
        let desc_end=article["description"].search("</p>")
        let desc=article["description"].slice(article["description"].search("<p>"),article["description"].search("</p>"))+"...</p>";
        if(desc_end+3>300){
            desc=article["description"].slice(article["description"].search("<p>"),300)+"...</p>"
        }
        return(
            <div className="la-article-container" key={index}>
                <div className="la-article-image-div">
                    <img 
                    src={img}
                    alt="article" 
                    className="la-article-image"/>
                    </div>
                
                <div className="la-article-info-div">
                <div className="la-article-info">

                <div className="la-article-body">
                    <div className="la-article-user-body">
                    <InfoOutlinedIcon style={{width:'20px',marginRight: '4px',paddingTop: '1px'}}/>
                    <div className="la-article-user">{article["user"]["name"]}</div>
                    </div>
                    <div className="la-article-title">{article["title"]}</div>
                    <div className="la-article-content">{parse(desc)}</div>
                </div>
                <div className="la-article-readmore-div">
                    <Button variant="contained" size="small" classes={{root: "read-more-btn"}} onClick={(e)=>props.viewArticle(index,"la")}>Read More</Button>
                    {/* <p className="la-article-readmore" onClick={(e)=>props.viewArticle(index,"la")}>Read More</p> */}
                    {!likedHeart[index]?<FavoriteBorderIcon onClick={()=>toggleHeart(index)} htmlColor="red" style={{width:'15px',marginLeft: '8px'}} className="la-like-icon"/>:
                        <FavoriteIcon onClick={()=>toggleHeart(index)} htmlColor="red" style={{width:'15px',marginLeft: '8px'}} className="la-like-icon"/>
                    }    
                </div>
                </div>
                
                </div>
                <Divider classes={{root: "divider-root"}} variant="fullWidth"/>
            </div>
        )
    })
    return(
        <div className="la-container">
            {articles}
        </div>
    )
}
export default (withRouter(LatestArticles))