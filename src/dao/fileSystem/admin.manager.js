import {__dirname, pathJoin} from "../../utils/utils.js";
import fs from "fs"

class AdminManager {
    constructor (){
        console.log(__dirname)
        this.path = pathJoin(__dirname,"data","admins.json")
            if (!fs.existsSync(this.path)) 
            throw "Error: File not Found";
    }
    async findAdminByEmailAndPassword(email,password){
            const adminUsers = await this.parseDataFromFile()
            const adminUser = adminUsers.admins.find((user)=> user.email === email && user.password === password )
            return adminUser
        }

    async findAdminByEmail(email){
        const adminUsers = await this.parseDataFromFile()
        const adminUser = adminUsers.admins.find((user)=> user.email === email)
        return adminUser
    }

    async parseDataFromFile() {
    return JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    }
} 

export default new AdminManager()