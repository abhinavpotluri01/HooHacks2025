import { View, Text, Touchable, Image } from 'react-native'
import React from 'react'
import { FlatList, ScrollView } from 'react-native'
import ShoeCard from '@/components/ShoeCard'
import { Link } from 'expo-router'
import {useState, useEffect} from 'react'
import {images}from '@/constants/images'

const EmptyState = () => {
  return (
    <View className="flex-1 justify-center items-center mt-24">
      <Image source={images.empty} className="w-72 h-72" resizeMode="contain" />  
      <Text className="text-3xl font-interBold text-gray-500">Much Empty... </Text>
      <Text className="text-lg font-interSemiBold text-gray-500">Please make some searches </Text>
    </View>
  )
}

const index = () => {

  const [shoeList, setShoeList] = useState([])
  
      useEffect(() => {
          const handleFetch = async () => {
              try{
              const response = await fetch(`https://b944-192-35-49-87.ngrok-free.app/get`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              })
              const data = await response.json()
              setShoeList(data)
              }
              catch(err){
                  console.log(err)
              }
          }
          handleFetch()
      }, [])

  return (
    <>
    
    <View className='absolute inset-0 -z-20 bg-[rgb(42, 42, 24)]' />
    <ScrollView className="flex-1"
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{
        minHeight: '100%',
        paddingBottom: 20,
      }}
      >
    <View className='mx-8 mt-12'>
      <Text className='font-interExtraBold text-3xl text-zinc-800'>Recent Searches</Text>
        

        <FlatList 
          data={[]}
          renderItem={({item}) => (
            <ShoeCard id={item}/>
          )}
          keyExtractor={(item) => item}
          numColumns={1}
          
          className="mt-8 pb-32 mx-2"
          
          scrollEnabled={false}
          ListEmptyComponent={() => (
                    <EmptyState
                      
                    />
                  )}
          />
      
    </View>
    </ScrollView>

    </>
  )
}





export default index