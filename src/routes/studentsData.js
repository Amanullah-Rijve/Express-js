import {Router } from "express";

const router2= Router();
// router level middleware
router2.use((req,res,next)=>{
    console.log(`Student Router: ${req.method} ${req.url}`);
    next();
});

// reuseable middleware
// student exsists?
const findStudent = (req,res,next)=>{
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id===id);

    if(!student){
        return res.status(404).json({
            success: false,
            message:'student not found'
        });
    };
    // keep student req
    req.student=student;
};

// valid department check
const checkDep = (req,res,next)=>{
    const validDep = ["CSE","EEE","BBA","SWE"];
    const {department}= req.body;

    if(department && !validDep.includes(department)){
        return res.status(404).json({
            success: false,
            message: `Department must be: ${validDepts.join(', ')}`
        });
    };
    next();
};

// Temp Data
let students = [
{ id: 1, name: "Rakib", department: "CSE", cgpa: 3.5 },
{ id: 2, name: "Sadia", department: "EEE", cgpa: 3.8 },
{ id: 3, name: "Tanvir", department: "BBA", cgpa: 3.2 },
];

// Get students
router2.get('/',(req,res)=>{
    res.status(200).json({
        success:true,
        count: students.length,
        data: students
    });
});
// get student by id
router2.get('/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const student = students.find(p => p.id ===id);

    // validation
    if(!student){
        return res.status(404).json({
            success: false,
            message: 'Student not found'
        });
    }
    res.status(200).json({
        success:true,
        data:student
    });
});
//  get student by department
router2.get('/',(req,res)=>{
    const {dept}= req.query;

    if(dept){
        const fltr= students.filter(s=> s.department ===dept);
        return res.status(200).json({
            success: true,
            count: fltr.length,
            data: fltr
        });
    };
    res.status(200).json({
    success: true,
    count: students.length,
    data: students
    });
});

// add student
router2.post('/',(req,res)=>{
    const {name,department,cgpa}= req.body;
    // validation
    if(!name||!department||!cgpa){
        return res.status(404).json({
            success: false,
            message:"name,department,cgpa not found"
        });
    };
    // add student
    const newStudent = {
    id: students.length+1,
    name,department,cgpa
    };
    students.push(newStudent);
    
    res.status(201).json({
        success: true,
        message:"student added",
        data: newStudent
    });
});

// update data
router2.put('/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const {name,department,cgpa}=req.body;
    const index = students.findIndex(s => s.id===id);

    if(index ==-1){
    return res.status(404).json({
        success: false,
        message: "student not found"
    });
    };
    // validation
    if(!name||!department||!cgpa){
        return res.status(400).json({
            success: false,
            message:'name,department,cgpa have to be added'
        });
    };
    students[index]={id,name,department,cgpa};

    res.status(200).json({
        success: true,
        message: "student updated",
        data: students[index]
    });
});
// update cgpa
router2.patch('/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const {cgpa}= req.body;
    const index = students.findIndex(s=> s.id===id);

    // check student
    if(index===-1){
        return res.status(404).json({
        success: false,
        message: 'Student not found'
        });
    };
    // cgpa validation
    if(!cgpa){
        return res.status(400).json({
            success:false,
            message:"have to give cgpa"
        });
    };
    if(cgpa <0||cgpa>4){
        return res.status(400).json({
            success:false,
            message:"cgpa must be between 0 -4"
        });
    };
    // only update cgpa
    students[index]= {...students[index],cgpa};

    res.status(200).json({
    success: true,
    message: 'CGPA updated',
    data: students[index]
    });
});
// Delete Data
router2.delete('/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const index = students.findIndex(s=> s.id===id);

    if(index ===-1){
        return res.status(404).json({
            success: false,
            message: "student not found"
        });
    };
    students.splice(index,1);
    res.status(200).json({
        success: true,
        message: "Student Deleted successfully"
    });
});

export default router2;