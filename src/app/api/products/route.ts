import { NextRequest } from 'next/server';
// UPDATE: Humne naya dbService connect kiya hai
import { dbConnect } from '@/lib/dbService'; 
import { Product } from '@/models';
import { asyncHandler } from '@/lib/errorHandler';
import { successResponse, createdResponse, validationErrorResponse, errorResponse } from '@/lib/apiResponse';
import { validateProduct } from '@/lib/validation';

/**
 * GET /api/products
 * Fetch all products with optional filtering
 */
export const GET = asyncHandler(async (req: NextRequest) => {
  console.log("🔵 GET /api/products called");
  
  // Connect to database (with fallback to local MongoDB)
  console.log("🔵 Calling dbConnect...");
  try {
    await dbConnect();
    console.log("🔵 dbConnect completed, fetching products...");
  } catch (dbError: any) {
    console.error("🔴 Database connection failed:", dbError.message);
    return errorResponse(
      "Database connection failed. Please check MongoDB setup.",
      503,
      [
        {
          error: dbError.message,
          solution: "See MONGODB_SETUP_COMPLETE.md for setup instructions"
        }
      ]
    );
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const isOnSale = searchParams.get('isOnSale');
  const brand = searchParams.get('brand');
  const search = searchParams.get('search');

  // Build query
  const query: any = {};
  if (category) query.category = category;
  if (isOnSale) query.isOnSale = isOnSale === 'true';
  if (brand) query.brand = brand;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Sort by newest first
  const products = await Product.find(query).sort({ createdAt: -1 });

  // Convert _id to id for frontend compatibility
  const formattedProducts = products.map(product => ({
    id: product._id.toString(),
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    discount: product.discount,
    image: product.image,
    sizeColorImages: product.sizeColorImages,
    category: product.category,
    subcategory: (product as any).subcategory,
    brand: product.brand,
    sizes: product.sizes,
    colors: product.colors,
    description: product.description,
    rating: product.rating,
    reviews: product.reviews,
    isOnSale: product.isOnSale,
    isNewArrival: product.isNewArrival,
    inStock: product.inStock,
    stock: product.stock,
    sold: product.sold,
  }));

  console.log(`✅ Fetched ${formattedProducts.length} products`);

  return successResponse(
    { count: formattedProducts.length, products: formattedProducts },
    'Products fetched successfully'
  );
});

/**
 * POST /api/products
 * Create a new product
 */
export const POST = asyncHandler(async (req: NextRequest) => {
  await dbConnect();

  const body = await req.json();
  
  // 🔴 LOG IMAGE VALIDATION
  if (!body.image) {
    console.error('🔴 POST /api/products: No image provided');
  } else {
    const isValidUrl = typeof body.image === 'string' && body.image.includes('http');
    console.log(`📥 POST /api/products - Image: ${isValidUrl ? '✅ Valid URL' : '❌ Invalid'}`, {
      imageLength: body.image?.length,
      isCloudinary: body.image?.includes('cloudinary')
    });
  }

  // Remove empty ID
  if (body.id === '') {
    delete body.id;
  }
  
  // Set defaults
  if (body.stock === undefined) body.stock = 100;
  if (body.sold === undefined) body.sold = 0;
  if (body.inStock === undefined) body.inStock = true;
  if (body.rating === undefined) body.rating = 0;
  if (body.reviews === undefined) body.reviews = 0;

  // Validate
  const validation = validateProduct(body);
  if (!validation.isValid) {
    console.error("❌ Validation failed:", validation.errors);
    return validationErrorResponse(validation.errors);
  }

  // Create product
  const product = await Product.create(body);
  
  console.log('✅ Product created:', {
    id: product._id.toString(),
    name: product.name,
    haImage: !!product.image
  });

  const formattedProduct = {
    id: product._id.toString(),
    ...product.toObject(),
  };

  return createdResponse(formattedProduct, 'Product created successfully');
});