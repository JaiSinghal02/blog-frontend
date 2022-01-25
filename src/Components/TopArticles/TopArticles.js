import React,{useState} from 'react'
import './TopArticles.css'
import Image from '../../image.png'
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import dateConverter from '../../functions/dateConverter'
import axios from 'axios'

export default function TopArticle(props){
    const [likedHeart,setLikedHeart]=useState(Array(5).fill(false))
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
        if(index<5){
            let img=Image
        if(article["articleImage"]){
            img=`https://fatmug-blog-server.herokuapp.com/${article["articleImage"].replace("\\","/")}`
        }
        return(
            <div className="ta-article-container" key={index}>
                
                <div className="ta-article-cont">
                    <div className="ta-article-body" >
                    <div className="ta-article-user-body">
                    <InfoOutlinedIcon style={{width:'17px',marginRight: '4px',paddingTop: '1px'}}/>
                    <div className="ta-article-user" onClick={(e)=>{props.viewArticle(index,"ta")}}>{article["user"]["name"]}</div>
                    </div>
                    
                    <div className="ta-article-title" onClick={(e)=>{props.viewArticle(index,"ta")}}>{article["title"]}</div>
                <div className="ta-article-readmore-div">
                    <p className="ta-article-date">{dateConverter(article["date"])}</p>
                    {!likedHeart[index]?<FavoriteBorderIcon onClick={()=>toggleHeart(index)} htmlColor="red" style={{width:'12px',marginLeft: '8px'}} className="ta-like-icon"/>:
                        <FavoriteIcon onClick={()=>toggleHeart(index)} htmlColor="red" style={{width:'12px',marginLeft: '8px'}} className="ta-like-icon"/>
                    }
                        
                </div>

                    </div>

                </div>
                <div className="ta-article-image-cont">
                    <div className="ta-article-image-div">

                    </div>
                    <img src={img} alt="article" className="ta-article-image"/>
                    </div>
            </div>
        )}
        else{
            return null
        }
    })
    return(
        <div className="ta-container">
            {articles}
        </div>
    )
}