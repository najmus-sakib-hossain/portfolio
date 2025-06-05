import { db } from '../db'
import { chats } from '../db/schema'
import { eq, and } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import type { Message } from '../../types/chat'

export type ChatVisibility = 'public' | 'private' | 'unlisted'

interface ChatData {
  id: string
  title: string
  creatorUid: string
  visibility: ChatVisibility
  messages: Message[]
  reactions: {
    likes: { [userId: string]: boolean }
    dislikes: { [userId: string]: boolean }
  }
  participants: string[]
  views: number
  uniqueViewers: string[]
  isPinned: boolean
  model: string
  createdAt: string
  updatedAt: string
}

export const chatService = {
  async createChat(title: string, creatorUid: string, visibility: ChatVisibility = 'private') {
    try {
      const chatId = uuidv4()
      const now = new Date().toISOString()

      const newChat = {
        id: chatId,
        title,
        creatorUid,
        visibility,
        messages: JSON.stringify([]),
        reactions: JSON.stringify({ likes: {}, dislikes: {} }),
        participants: JSON.stringify([creatorUid]),
        views: 0,
        uniqueViewers: JSON.stringify([]),
        isPinned: false,
        model: 'gemini-2.0-flash-exp',
        createdAt: now,
        updatedAt: now,
      }

      await db.insert(chats).values(newChat)
      return chatId
    } catch (error) {
      console.error('Error creating chat:', error)
      throw error
    }
  },

  async addMessage(chatId: string, message: Message, userId: string) {
    try {
      // Get current chat
      const existingChat = await db.query.chats.findFirst({
        where: eq(chats.id, chatId)
      })

      if (!existingChat) {
        throw new Error('Chat not found')
      }

      const currentMessages = JSON.parse(existingChat.messages) as Message[]
      const participants = JSON.parse(existingChat.participants) as string[]

      // Add the new message with timestamp
      const newMessage = {
        ...message,
        userId,
        timestamp: new Date().toISOString()
      }

      currentMessages.push(newMessage)

      // Add user to participants if not already included
      if (!participants.includes(userId)) {
        participants.push(userId)
      }

      // Update the chat
      await db
        .update(chats)
        .set({
          messages: JSON.stringify(currentMessages),
          participants: JSON.stringify(participants),
          updatedAt: new Date().toISOString()
        })
        .where(eq(chats.id, chatId))
    } catch (error) {
      console.error('Error adding message:', error)
      throw error
    }
  },
  async updateReaction(chatId: string, messageIndex: number, userId: string, reactionType: 'like' | 'dislike') {
    try {
      const existingChat = await db.query.chats.findFirst({
        where: eq(chats.id, chatId)
      })

      if (!existingChat) return

      const reactions = JSON.parse(existingChat.reactions) as any
      
      // Initialize reactions structure if needed
      if (!reactions[`${reactionType}s`]) {
        reactions[`${reactionType}s`] = {}
      }

      // Toggle the reaction
      if (reactions[`${reactionType}s`][userId]) {
        delete reactions[`${reactionType}s`][userId]
      } else {
        reactions[`${reactionType}s`][userId] = true
      }

      // Update the chat
      await db
        .update(chats)
        .set({
          reactions: JSON.stringify(reactions),
          updatedAt: new Date().toISOString()
        })
        .where(eq(chats.id, chatId))
    } catch (error) {
      console.error('Error updating reaction:', error)
      throw error
    }
  },
  async getChatHistory(chatId: string) {
    try {
      const chat = await db.query.chats.findFirst({
        where: eq(chats.id, chatId)
      })
      
      if (!chat) {
        return null
      }

      // Parse JSON fields back to proper types
      return {
        ...chat,
        messages: JSON.parse(chat.messages),
        participants: JSON.parse(chat.participants),
        reactions: JSON.parse(chat.reactions),
        uniqueViewers: JSON.parse(chat.uniqueViewers)
      } as ChatData
    } catch (error) {
      console.error('Error getting chat history:', error)
      throw error
    }
  },
  async updateChatVisibility(chatId: string, visibility: ChatVisibility, userId: string) {
    try {
      const existingChat = await db.query.chats.findFirst({
        where: eq(chats.id, chatId)
      })
      
      if (!existingChat) throw new Error('Chat not found')
      if (existingChat.creatorUid !== userId) throw new Error('Unauthorized')

      await db
        .update(chats)
        .set({ 
          visibility,
          updatedAt: new Date().toISOString()
        })
        .where(eq(chats.id, chatId))
    } catch (error) {
      console.error('Error updating chat visibility:', error)
      throw error
    }
  },
  // Add new method to track views
  async incrementViews(chatId: string, userId: string) {
    try {
      const existingChat = await db.query.chats.findFirst({
        where: eq(chats.id, chatId)
      })

      if (!existingChat) return

      const uniqueViewers = JSON.parse(existingChat.uniqueViewers) as string[]
      const hasViewed = uniqueViewers.includes(userId)

      if (!hasViewed) {
        uniqueViewers.push(userId)
        
        await db
          .update(chats)
          .set({
            views: existingChat.views + 1,
            uniqueViewers: JSON.stringify(uniqueViewers),
            updatedAt: new Date().toISOString()
          })
          .where(eq(chats.id, chatId))
      }
    } catch (error) {
      console.error('Error incrementing views:', error)
      throw error
    }
  },
  // Add method to get view statistics
  async getViewStats(chatId: string) {
    try {
      const chat = await db.query.chats.findFirst({
        where: eq(chats.id, chatId)
      })
      
      if (!chat) {
        return null
      }
      
      const uniqueViewers = JSON.parse(chat.uniqueViewers) as string[]
      
      return {
        totalViews: chat.views,
        uniqueViewers: uniqueViewers.length
      }
    } catch (error) {
      console.error('Error getting view stats:', error)
      throw error
    }
  }
}