import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import ShoePage from '@/components/ShoePage'
import { useEffect, useState } from 'react'
import { FlatList } from 'react-native'


const EmptyState = () => {
    return (
    <View className="flex-col gap-y-4 mt-4 border rounded-xl border-zinc-700 px-2 py-2">
        <View className='w-full h-48 border border-zinc-700 bg-zinc-500 rounded-xl animate-pulse'/>
        <View>
            <View className=' text-zinc-800 w-3/5 h-12 bg-zinc-500 rounded-2xl animate-pulse'></View>
            <View className=' w-2/5 h-8 bg-zinc-500 rounded-2xl animate-pulse mt-2'></View>
            
            <View className='w-full rounded-full h-8 bg-zinc-500 py-1.5 px-5 text-white text-center flex items-center justify-center mt-2'>
            </View>
        </View>
        </View>
    )
}

const index = () => {
    const {image} = useLocalSearchParams()
    const [shoeArray, setShoeArray] = useState([])

    useEffect(() => {
        const handleFetch = async () => {
            try{
                console.log(image)
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/process-imgur-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: image
                })
            })
            const data = await response.json()
            console.log(data)
            setShoeArray(data)
            }
            catch(err){
                console.log(err)
            }
            
        }

        handleFetch();
    }, [])

  return (
    <>
    <View className='absolute inset-0 -z-20 bg-[rgb(42, 42, 24)]' />
    <ScrollView className="flex-1"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
        minHeight: '100%',
        paddingBottom: 10,
        }}
        >
        <View className='mx-8 mt-12'>
            <Text className="font-interExtraBold text-3xl text-zinc-800">Results</Text>
        
            <FlatList 
                data={shoeArray}
                renderItem={({item}) => (
                <ShoePage shoe={item}/>
                )}
                keyExtractor={(item : any) => item.global_rank.toString()}
                numColumns={1}
                
                className="mt-8 pb-32 mx-2"
                
                scrollEnabled={false}
                

                ListEmptyComponent={() => (
                    <>
                    <EmptyState
                      
                    />
                    <EmptyState/>
                    <EmptyState/>
                    </>
                  )}
                    
                />
        
        </View>
       
    </ScrollView>
    </>
    
  )
}

export default index