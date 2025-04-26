import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import mongoose from 'mongoose';

// GET /api/categories?userId=123
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    await connectToDatabase();

    // Get optional query parameters for filtering
    const type = req.nextUrl.searchParams.get('type');

    // Build query
    const query: any = { userId };

    if (type && (type === 'income' || type === 'expense')) {
      query.type = type;
    }

    const categories = await Category.find(query).sort({ name: 1 });

    console.log(`Retrieved ${categories.length} categories for user ${userId}`);

    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch categories',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// POST /api/categories
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.userId || !data.name || !data.color || !data.type) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    await connectToDatabase();

    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(data.userId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user ID format'
      }, { status: 400 });
    }

    // Check if category with same name already exists for this user
    const existingCategory = await Category.findOne({
      userId: data.userId,
      name: data.name,
      type: data.type
    });

    if (existingCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category with this name already exists'
      }, { status: 400 });
    }

    // Create new category
    const newCategory = new Category(data);

    await newCategory.save();
    console.log(`New category created: ${newCategory._id} (${data.name}) for user ${data.userId}`);

    return NextResponse.json({
      success: true,
      data: newCategory
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create category',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// PUT /api/categories?id=123
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Category ID is required'
      }, { status: 400 });
    }

    const data = await req.json();

    await connectToDatabase();

    // Find and update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    console.log(`Category updated: ${id} (${updatedCategory.name})`);

    return NextResponse.json({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update category',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// DELETE /api/categories?id=123
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Category ID is required'
      }, { status: 400 });
    }

    await connectToDatabase();

    // Check if this is a default category
    const category = await Category.findById(id);

    if (category?.isDefault) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete default categories'
      }, { status: 400 });
    }

    // Find and delete the category
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    console.log(`Category deleted: ${id} (${deletedCategory.name})`);

    return NextResponse.json({
      success: true,
      data: { id }
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete category',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
