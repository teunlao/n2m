import { Badge, Box, Button, Flex, For, Heading, Image, Text } from '@chakra-ui/react'
import { ArticlesProviderToken, ArticlesQueryResourceToken } from './tokens.ts'
import { injectDependency } from '@n2m/core-di'
import { useGate } from 'effector-react'
import { useResourceShape } from '@n2m/core-modules/react'
import React from 'react'
import { RouterLink } from '@n2m/router/react'
import { routes } from '../../router.config.tsx'
import { useConfig } from '@n2m/core-config/shared'
// @ts-ignore
import { Post } from '../../../../payload-app/src/payload-types.ts'

export const PostHero: React.FC<{ post: Post }> = ({ post }) => {
  const { categories, meta: { description } = {}, populatedAuthors, publishedOn, title } = post

  return (
    <>
      <Flex mb={4} flexWrap="wrap">
        {categories?.map((category, index) => (
          <Badge key={index} colorScheme="teal" size="md" mr={2} mb={2}>
            {typeof category === 'string' ? category : category.title || 'Untitled'}
          </Badge>
        ))}
      </Flex>
      <Heading size="xl" mb={4} fontWeight="bold">
        {title}
      </Heading>
      <Text fontSize="md" mb={4}>
        {description}
      </Text>
      <Flex alignItems="center" mb={4}>
        <Text fontSize="sm">
          By {populatedAuthors?.map((author) => author.name).join(', ')}
          {publishedOn && ` • ${new Date(publishedOn).toDateString()}`}
        </Text>
      </Flex>
    </>
  )
}

export const ArticleCard: React.FC<{ post: Post }> = ({ post }) => {
  const { id, meta: { image: metaImage } = {} } = post

  const imageSrc = `${useConfig().requestUrl.origin}/media/${typeof metaImage === 'string' ? metaImage : metaImage?.filename}`

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      h={{ base: 'auto', md: '360px' }}
      position="relative"
      overflow="hidden"
      boxShadow="md"
      borderRadius="lg"
      my={2}
      transition="all 0.3s"
    >
      <Box w={{ base: '100%', md: '50%' }} h={{ base: '200px', md: '100%' }} display={{ base: 'block', md: 'none' }}>
        <Image src={imageSrc} alt={post.title} objectFit="cover" w="100%" h="100%" />
      </Box>
      <Flex w={{ base: '100%', md: '50%' }} direction="column" justify="center" p={6} color="white">
        <PostHero post={post} />
        <Button asChild mt={4} cursor="pointer" variant="outline" size="md" colorScheme="white">
          <RouterLink to={routes.Article} params={{ id }}>
            Read More
          </RouterLink>
        </Button>
      </Flex>
      <Box w="50%" h="100%" position="relative" overflow="hidden" display={{ base: 'none', md: 'block' }}>
        <Image loading="lazy" objectFit="cover" src={imageSrc} alt={post.title} w="100%" h="100%" />
      </Box>
    </Flex>
  )
}

export const ArticlesSegment = () => {
  const { gate } = injectDependency(ArticlesProviderToken)
  useGate(gate)
  const {
    data: { posts },
  } = useResourceShape(ArticlesQueryResourceToken)

  return (
    <Flex direction="column" gap={4} w="full">
      <For each={posts}>{(post) => <ArticleCard key={post.id} post={post} />}</For>
    </Flex>
  )
}
