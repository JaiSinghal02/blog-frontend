import * as actionTypes from '../actions/actions'

const intialState={
    publishData: {
        title: "",
        author: "",
        description: "",
        articleImage: ""
    },
    isEditing: false,
    articleId:null,
    isAdmin:false
}
const reducer=(state=intialState,action)=>{
    switch(action.type){
        case actionTypes.SET_PUBLISH_DATA:
            const key=Object.keys(action.data)
            return{
                ...state,
                publishData: {
                    ...state.publishData,
                    [key]: action.data[key]
                }
            }
        case actionTypes.UNSET_PUBLISH_DATA:
            return{
                ...state,
                publishData: {
                    title: "",
                    description: "",
                    articleImage: "",
                    author: ""
                }
            }
        case actionTypes.TOGGLE_EDITING:
            console.log(action.id)
            return{
                ...state,
                publishData:{
                    ...state.publishData
                },
                isEditing: !state.isEditing,
                articleId: action.id
            }
        case actionTypes.SET_EDITING_DATA:
            let article = action.articleData
            return{
                ...state,
                publishData:{
                    title: article.title,
                    author: article.author,
                    description: article.description,
                    articleImage: article.articleImage
                }
            }
        case actionTypes.SET_ADMIN_ACCESS:
            return{
                ...state,
                publishData:{
                    ...state.publishData
                },
                isAdmin: action.adminAccess
            }
        default:
            return state
    }
}

export default reducer