import { UserRepository } from "../models/repository/user.repository.js";

const userRepository = new UserRepository();

class userService {
  findUserById = async (id) => 
    await userRepository.getOne(id);
  findUserByCriteria = async (criteria) =>
    await userRepository.getOneByCriteria(criteria);
  createUser = async (user) => 
    await userRepository.create(user);
}
export default new userService();
