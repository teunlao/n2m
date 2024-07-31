import type { Comment, Post } from '../../../../payload/payload-types'
import { useCurrentRoute } from '@n2m/router/react'
import { ArticleProviderToken, CommentsSegmentToken } from '../tokens.ts'
import { injectProvider } from '@n2m/core-modules'
import { useUnit } from 'effector-react'
import React from 'react'
import { Badge, Box, Container, Flex, Heading, HStack, Image, Link, Text, VStack } from '@chakra-ui/react'
import { SegmentContainerCached } from '@n2m/core-modules/react'
import { useConfig } from '@n2m/core-config/shared'

export type ArticleSegmentProps = {
  comments: Comment[]
  post: Post
}

const ArticleBlocks: React.FC<{ post: any }> = ({ post }) => {
  const renderRichText = (richText: any) => {
    if (!richText || !richText.root || !richText.root.children) return null

    return richText.root.children.map((child: any, index: number) => {
      switch (child.type) {
        case 'heading':
          return (
            <Heading size="xl" key={index} mt={6} mb={4}>
              {child.children[0].text}
            </Heading>
          )
        case 'paragraph':
          return (
            <Text key={index} mb={4}>
              {child.children[0].text}
            </Text>
          )
        default:
          return null
      }
    })
  }

  const renderLayoutBlock = (block: any, index: number) => {
    switch (block.blockType) {
      case 'content':
        return (
          <Box key={index} py={6}>
            {block.columns.map((column: any, colIndex: number) => (
              <Box key={colIndex} width={column.size === 'full' ? '100%' : '66%'}>
                {renderRichText(column.richText)}
              </Box>
            ))}
          </Box>
        )
      case 'contentMedia':
        return (
          <Flex
            key={index}
            py={6}
            direction={{ base: 'column', md: 'row' }}
            align="center"
            gap={{ base: '2rem', sm: '3rem', md: '4rem', lg: '6rem' }}
          >
            <Box width={{ base: '100%', md: '50%' }}>{renderRichText(block.richText)}</Box>
            <Box width={{ base: '100%', md: '50%' }}>
              {block.media && (
                <Image
                  src={`${useConfig().requestUrl.origin}/media/${block.media.filename}`}
                  alt={block.media.alt || 'Content image'}
                  objectFit="cover"
                  w="100%"
                  h="auto"
                />
              )}
            </Box>
          </Flex>
        )
      default:
        return null
    }
  }

  return (
    <VStack gap={8} align="stretch">
      {/* Hero Image */}
      {post.hero && post.hero.media && (
        <Box mb={6}>
          <Image
            src={`${useConfig().requestUrl.origin}/media/${post.hero.media.filename}`}
            alt={post.hero.media.alt || post.title}
            w="100%"
            h="auto"
            objectFit="cover"
          />
          <Text fontSize="sm" mt={2} color="gray.400">
            Photo by{' '}
            <Link href="#" color="blue.300">
              {post.hero.media.caption}
            </Link>{' '}
            on Unsplash.
          </Text>
        </Box>
      )}

      {/* Content */}
      <Box>{post.layout?.map(renderLayoutBlock)}</Box>

      {/* Premium Content */}
      {post.enablePremiumContent && (
        <Box mt={10}>
          <Heading as="h2" size="xl" mb={4}>
            Premium Content
          </Heading>
          {post.premiumContent?.map(renderLayoutBlock)}
        </Box>
      )}
    </VStack>
  )
}

export const ArticleSegment: React.FC<ArticleSegmentProps> = () => {
  const { params } = useCurrentRoute()
  const { createArticleApi } = injectProvider(ArticleProviderToken)
  const { articleQuery } = createArticleApi(params?.id)

  const { data: post } = useUnit(articleQuery)

  if (!post) return null

  const { categories } = post

  const imageSrc = `${useConfig().requestUrl.origin}/media/${typeof post.meta?.image === 'string' ? post.meta?.image : post.meta?.image?.filename}`

  return (
    <Box py={6}>
      <Flex gap="2rem" direction={{ base: 'column', md: 'row' }}>
        <Box w={{ base: '100%', md: '50%' }}>
          {categories?.map((category: any, index: number) => (
            <Badge key={index} colorScheme="teal" size="md" mb={6}>
              {typeof category === 'string' ? category : category.title || 'Untitled'}
            </Badge>
          ))}
          {/*@ts-expect-error chakra v3 types mismatch */}
          <Heading size={{ base: '3xl', md: '4xl', lg: '6xl' }} mb={6} lineHeight="1.2">
            {post.title}
          </Heading>
          <HStack gap={2} mb={6}>
            <Text fontSize="lg">By {post.populatedAuthors?.map((author: any) => author.name).join(',')}</Text>
            <Text fontSize="lg">•</Text>
            <Text fontSize="lg"> {new Date(post!.publishedOn!).toDateString()}</Text>
          </HStack>
          <Text fontSize="lg">{post!.meta!.description}</Text>
        </Box>

        <Box w={{ base: '100%', md: '50%' }} position="relative" overflow="hidden">
          <Image h="100%" loading="lazy" objectFit="cover" src={imageSrc} alt={post.title} />
        </Box>
      </Flex>
      <ArticleBlocks post={post} />
      <SegmentContainerCached token={CommentsSegmentToken} />
    </Box>
  )
}
