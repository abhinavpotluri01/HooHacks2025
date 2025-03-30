import { View, Text, Touchable } from 'react-native'
import React from 'react'
import { FlatList, ScrollView } from 'react-native'
import ShoeCard from '@/components/ShoeCard'
import { Link } from 'expo-router'
const index = () => {
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
          data={['1', '2']}
          renderItem={({item}) => (
            <ShoeCard id={item}/>
          )}
          keyExtractor={(item) => item}
          numColumns={1}
          
          className="mt-8 pb-32 mx-2"
          
          scrollEnabled={false}
          />
      
    </View>
    </ScrollView>

    </>
  )
}



export default index