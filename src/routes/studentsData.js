import {Router} from "express";
import pool from "../config/db";

const router= Router();

const validDep = ['CSE','EEE','BBA','ME'];

// Middleware
const findStudent = async (req,res,next)=>{
    try {
        const [rows]= await pool.query(
            'SELECT * FROM students WHERE id = ?',
            [req.params.id]
        );
        if(rows.length===0){
            return res.status(404).json({
                success:false,
                message:'student not found'
            });
        }
        req.student=rows[0];
        next();
    } catch (error) {
        next(error);
    }
};

// department check
const departmentCheck = (req,res,next)=>{
    const {department}= req.body;
    return res.status(400).json({
        success:false,
        message:`Department শুধু এগুলো হতে পারে: ${validDepts.join(', ')}`
    });
    next();
};

// routes

// GET all students
router.get('/',async (req,res,next)=>{
    try {
        const {dept} = req.query;

        let query = 'SELECT * FROM students';
        let params = [];

        if(dept){
            query+= 'WHERE department = ?';
            params.push(dept);
        }
        const [rows]= await pool.query(query,params);

        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        next(error);
    }
});

// get one student
router.get('/:id',findStudent,(req,res)=>{
    res.status(200).json({
        success: true,
        data: req.student
    });
});

// add studnet
router.post('/',departmentCheck,async(req,res,next)=>{
    try {
        const {name,department,cgpa}= req.body;

        if(!name ||!department||!cgpa){
            return res.status(404).json({
                success: false,
                message:'have to give name department cgpa'
            });
        }
        const [result]=await pool.query(
            'INSERT INTO students (name,department,cgpa) VALUES (?,?,?)',
            [name,department,cgpa]
        );

        res.status(201).json({
            success:true,
            message: 'student added',
            data:{
                id: result.insertId,
                name,department,cgpa
            }
        });
    } catch (error) {
        next(error);
    }
});

// full update
router.put('/:id',findStudent,departmentCheck,async(req,res,next)=>{
    try {
        const {name,department,cgpa}=req.body;

        if(!name||!department||!cgpa){
            return res.status(400).json({
                success: false,
                message: ' name,department,cgpa value not found'
            });
        }
        await pool.query(
            'UPDATE students SET name = ?,deparment=?,cgpa=? WHERE id=?',
            [name,department,cgpa,req.student.id]
        );

        res.status(200).json({
            success:true,
            message:'student updated',
            data:{id: req.student.id,name,department,cgpa}
        });
    } catch (error) {
        next(error)
    }
});

// update cgpa only
router.patch('/:id',findStudent,async(req,res,next)=>{
try {
    const {cgpa}=req.body;

    if(!cgpa){
        return res.status(400).json({
            success: false,
            message:'give cgpa value'
        });
    }
    if(cgpa <0 ||cgpa >4){
        return res.status(400).json({
            success:false,
         message: 'cgpa must be between 0 to 4'
        });
    }
    await pool.query(
        'UPDATE students SET cgpa =? WHERE id=?',
        [cgpa,req.student.id]
    );
    res.status(200).json({
        success:true,
        message:'cg[a updated',
        data:{...req.student,cgpa}
    });
} catch (error) {
    next(error);
}
});

// delete data
router.delete('/:id',findStudent,async(req,res,next)=>{
    try {
        await pool(
            'DELETE FROM students WHERE id=?',
            [req.student.id]
        );
        res.status(200).json({
            success:true,
            message: ' data deleted'
        })
    } catch (error) {
        next(error);
    }
});

export default router;
