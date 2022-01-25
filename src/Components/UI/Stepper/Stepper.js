import React,{useState} from 'react';
import './Stepper.css'
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';



export default function ActiveLastBreadcrumb(props) {
  const [activeStep,setActiveStep]=useState(0)
  function handleClick(i) {
    setActiveStep(i)
    props.stepperClick(i)
  }
  let len=props.length;
const num=Math.round(Math.ceil(len/props.divider));
let steppers=[]
for(let i=0;i<num;++i){
  steppers.push(<Step key={i} className="stepper-step" onClick={()=>handleClick(i)}>
    <StepLabel ></StepLabel>
  </Step>)
}
  return (
    <Breadcrumbs separator="" aria-label="breadcrumb">
      <Stepper nonLinear={true} activeStep={activeStep}>
      {steppers}
      </Stepper>
    </Breadcrumbs>
  );
}
