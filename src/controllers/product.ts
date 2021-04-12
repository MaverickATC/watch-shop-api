import { Request, Response } from 'express'

//models
import Product, { IProduct } from '../models/product'

//interfaces
import { IRequestWithAdmin } from '../middleware/auth'

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const productsList = await Product.find().populate('specs')
    res.status(200).send(productsList)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.id }).populate(
      'specs',
    )
    res.status(200).send(product)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createProduct = async (req: IRequestWithAdmin, res: Response) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      mainImgUrl: req.body.mainImgUrl,
      price: req.body.price,
      forWhom: req.body.forWhom,
      changers: { admin: req.admin, date: new Date(Date.now()), message: 'Created' },
    })
    if (!product) {
      return res.status(400).json({ message: 'Product was not created' })
    }
    return res.status(201).json({
      name: product.name,
      slug: product.slug,
      description: product.description,
      mainImgUrl: product.mainImgUrl,
      price: product.price,
      discount: product.discount,
      countInStock: product.countInStock,
      isFeatured: product.isFeatured,
      forWhom: product.forWhom,
      changers: product.changers,
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const updateProduct = async (req: IRequestWithAdmin, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.id })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    product.name = req.body.name
    product.description = req.body.description
    product.mainImgUrl = req.body.mainImgUrl
    product.imagesUrls = req.body.imagesUrls
    // specs?: {
    //   spec: ISpec['_id']
    //   value = req.body.
    // }[]
    // modifications?: IModification[]
    product.price = req.body.price
    product.discount = req.body.discount
    product.countInStock = req.body.countInStock
    product.isFeatured = req.body.isFeatured
    product.forWhom = req.body.forWhom
    product.changers!.push({
      admin: req.admin,
      date: new Date(Date.now()),
      message: 'Edited'
    })

    await product.save()

    return res.status(201).json(product)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const archiveProduct = async (req: IRequestWithAdmin, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.id })
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    product.archived = true
    product.changers!.push({
      admin: req.admin,
      date: new Date(Date.now()),
      message: 'Archived'
    })
    await product.save()
    return res.status(200).json({ message: 'Product was archived' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const unArchiveProduct = async (req: IRequestWithAdmin, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.id })
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    product.archived = false
    product.changers!.push({
      admin: req.admin,
      date: new Date(Date.now()),
      message: 'Unarchived'
    })
    await product.save()
    return res.status(200).json({ message: 'Product was unarchived' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const deleteProduct = async (req: IRequestWithAdmin, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.id })
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    if (!product.archived) {
      return res.status(405).json({ message: 'Product should be archived first' })
    }
    await product.remove()
    return res.status(200).json({ message: 'Product was deleted' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
