import React,{useState,useEffect} from 'react'
import './LandingPage.css'
import LatestArticles from '../LatestArticles/LatestArticles'
import TopArticles from '../TopArticles/TopArticles'
import Stepper from '../UI/Stepper/Stepper'
import axios from 'axios'

function LandingPage(props){
    const [stepValue,setStepValue]=useState(0)
    const [latestArticle,setLatestArticle]=useState([])
    // const [topArticle,setTopArticle]=useState([])
    
    useEffect(() => {
            axios.get('/api/article/latest')
            .then(res=>{
                latestArticleData(res.data)
            })
            .catch(err=>{
                console.log(err)
            })
            // axios.get('/api/article/hottest')
            // .then(res=>{
            //     console.log(res)
            //     topArticleData(res.data)
            // })
            // .catch(err=>{
            //     console.log(JSON.parse(JSON.stringify(err)))
            // })
    }, [props.location])
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, [stepValue])
    function latestArticleData(data){
        const start=stepValue*10
        const end=Math.min(start+10,data.length)
        setLatestArticle(data.slice(start,end))
    }
    // function topArticleData(data){
    //     setTopArticle(data)
    // }
    function stepperClick(i){
        setStepValue(i)
    }
    function viewArticle(index,caller){
        let mul,data
        if(caller==="la"){
            mul=10
            data=latestArticle
        }
        // else if(caller==="ta"){
        //     mul=0
        //     data=topArticle
        // }
        const pos=mul*stepValue+index
        localStorage.setItem("articleId",data[pos]["_id"])
        props.history.push('/viewarticle')
    }
    
    return(
        <>
        <div className="landing-page-container">
            <div className="landing-page-la-container">
                {!latestArticle.length?<p style={{background: 'white',fontSize: '25px'}}>Articles Coming Soon..</p>:
                <LatestArticles data={latestArticle} viewArticle={(i,c)=>viewArticle(i,c)} articleNumber={stepValue}/>}
            </div>

            {/* <div className="landing-page-ta-container">
                <div  className="landing-page-ta-top">
            <div className="landingpage-ta-line"><hr></hr></div>
            <div className="landingpage-ta-head">
            <h4>Top Articles</h4>

            </div>

                <div className="landingpage-ta-line"><hr></hr></div>
                </div>
                <div className="landing-page-ta-article-container">
                <TopArticles data={topArticle} viewArticle={(i,c)=>viewArticle(i,c)}/>
                </div>
                
                
            </div> */}
        </div>
        {latestArticle.length>10?
        <div className="landing-page-footer">
            <Stepper length={latestArticle.length} divider={10} stepperClick={stepperClick}/>
        </div>:null
        }
        </>
    )
}
export default LandingPage