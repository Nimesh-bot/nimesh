import axiosInstance from "../utils/axios.config";
import { getDesignFailure, getDesignStart, getDesignSuccess } from "./features/designSlice";
import { getProjectFailure, getProjectStart, getProjectSuccess } from "./features/projectSlice";
import { getSkillsFailure, getSkillsStart, getSkillsSuccess } from "./features/skillsSlice"

export const getAllSkills = async (dispatch) => {
    dispatch(getSkillsStart());
    try{
        const res = await axiosInstance.get('/skills');
        dispatch(getSkillsSuccess(res.data.skills));
    }
    catch(err){
        dispatch(getSkillsFailure());
    }
}

export const getAllProjects = async (dispatch) => {
    dispatch(getProjectStart());
    try{
        const res = await axiosInstance.get('/projects');
        dispatch(getProjectSuccess(res.data.projects));
    }
    catch(err) {
        dispatch(getProjectFailure());
    }
}

export const getAllDesigns = async (dispatch) => {
    dispatch(getDesignStart());
    try {
        const res = await axiosInstance.get('/designs');
        dispatch(getDesignSuccess(res.data.designs));
    }
    catch(err) {
        dispatch(getDesignFailure());
    }
}