import toast from "react-hot-toast"
import { apiConnector } from "../apiConnect"
import { categories } from "../apis"
const {
    GET_CATEGORY_PAGE_DETAILS_API
} = categories
export const getCatalogPageData = async (categoryId) => {
    let result = []
    const toastId = toast.loading("Loading Catalog Data...")
    try{
        const response = await apiConnector("POST", GET_CATEGORY_PAGE_DETAILS_API,{categoryId: categoryId});
        console.log("Printing Catalog Page Details: ", response.data.data);
        if(!response.data.success) {
            throw new Error("Failed to fetch Catalog Page Data");
        }
        result = response.data;
        toast.success("Catalog Data Loaded Successfully", {id: toastId})

    }
    catch(err) {
        console.log("Error fetching Catalog Page Data", err);
        toast.error("Error fetching Catalog Data", {id: toastId})
    }
    toast.dismiss(toastId);
    return result;
}