import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      avatarUrl,
      jobTitle,
      company,
      linkedinUrl,
      websiteUrl,
      bio,
      language,
      dateOfBirth,
      gender
    } = body

    // Update user profile in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name || null,
      },
    })

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      }
    })

  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = session.user.email

    // Find the user first to get their ID
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete all user data in order (respecting foreign key constraints)
    // This will cascade delete all related records

    // Delete all CVs
    await prisma.cV.deleteMany({
      where: { userId: user.id }
    })

    // Delete all Letters
    await prisma.letter.deleteMany({
      where: { userId: user.id }
    })

    // Delete all Subscriptions
    await prisma.subscription.deleteMany({
      where: { userId: user.id }
    })

    // Delete all Sessions
    await prisma.session.deleteMany({
      where: { userId: user.id }
    })

    // Delete all Accounts (OAuth connections)
    await prisma.account.deleteMany({
      where: { userId: user.id }
    })

    // Finally, delete the user
    await prisma.user.delete({
      where: { id: user.id }
    })

    console.log(`[User API] User ${userEmail} and all data deleted successfully`)

    return NextResponse.json({
      message: 'Account and all data deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting user account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
} 