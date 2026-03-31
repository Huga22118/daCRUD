import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try{
        const totalProducts = await prisma.product.count();
        const outOfStock = await prisma.product.count(
            {
                where: {
                    stock: 0},
            }
        );
        const  lowStock = await prisma.product.count({
            
                where: {
                    stock:{
                        gt: 0,
                        lt: 5,
                    },
                },
            
        });
        res.status(200).json({
            totalProducts,outOfStock,lowStock,
        });
    }
    catch (error){
        console.error("Error Fetching product stats", error);
    res.status(500).json({message: "Cannot Fetch Product statistics!"});
    }
}