import {fakerES_MX as faker} from '@faker-js/faker'
export const generateProducts = ()=>
{
    const stock = faker.number.int({min:0, max: 500})
    const thumbnails = []
    const imagelimit = faker.number.int({min:1,max:12})
    for (let i = 0; i < imagelimit; i++)
        thumbnails.push(faker.image.url())

    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(8),
        price: faker.commerce.price({max:50000}),
        status: stock > 0,
        stock,
        category: faker.commerce.department(),
        thumbnails
    }

}