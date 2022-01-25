import React from 'react'
import './YourArticle.css'
import Image from '../../../image.png'
import NoteAddOutlinedIcon from '@material-ui/icons/NoteAddOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import parse from 'html-react-parser';


export default function YourArticle(props) {
    let articleContent=props.data.map((article,index)=>{
        let img=Image
        if(article["coverImage"]){
            img=`https://free4store.blob.core.windows.net/blog-images/${article["coverImage"]}`
        }
        let desc_end=article["description"].search("</p>")
        let desc=article["description"].slice(article["description"].search("<p>"),article["description"].search("</p>")+4);
        if(desc_end+3>100){
            desc=article["description"].slice(article["description"].search("<p>"),100)+"...</p>"
        }
        return(
            <React.Fragment key={index}>
            <div  className="ya-article-content" >
            <div className="ya-article-image-container">
                <div className="ya-article-image-body">
                    <img src={img} alt="article" className="ya-article-image"/>
                </div>
            </div>
            <div className="ya-article-text-container" onClick={(e)=>props.articleClicked(index)}>
                <div className="ya-article-text-body">
                    <div className="ya-article-text-title"><p>{article["title"]}</p></div>
                    <div className="ya-article-text-desc">
                        {parse(desc)}
                        {<p>...</p>}
                        </div>
                </div>
            </div>
            <div className="ya-article-icons-container">
                <div className="ya-article-icons-body">
                    <Tooltip title="Edit Article" arrow>
                    <NoteAddOutlinedIcon onClick={(e)=>props.editArticle(index)}  className="ya-article-icon-addnote"/>
                    </Tooltip>
                    <Tooltip title="Delete Article" arrow>
                    <DeleteOutlinedIcon onClick={(e)=>props.deleteArticle(index)} className="ya-article-icon-deletenote"/>
                    </Tooltip>
                    </div>
            </div>
            
        </div>
        {props.data.length !==index+1?<Divider classes={{root: "ya-divider-root"}} variant="fullWidth"/>:null}
        </React.Fragment>
        )
    })
    return (
        <>
        {articleContent}
        
        </>
    )
}