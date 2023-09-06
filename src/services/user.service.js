import { UserRepository } from "../dao/repository/user.repository.js";

const userRepository = new UserRepository();

class userService {
  findUserById = async (id) => 
  this.#removeSensitiveUserData(await userRepository.getOne(id));
  findUserByCriteria = async (criteria) =>
  this.#removeSensitiveUserData(await userRepository.getOneByCriteria(criteria));
  createUser = async (user) => 
  this.#removeSensitiveUserData(await userRepository.create(user));

  #removeSensitiveUserData= (user)=>{
    if(user){
      delete user.password
    }
    return user
  }
}
export default new userService();
