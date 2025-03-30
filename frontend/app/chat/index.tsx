import { View, Text, TextInput, Image, ScrollView } from 'react-native'
import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useLocalSearchParams } from 'expo-router' // For retrieving navigation parameters
import AntDesign from '@expo/vector-icons/AntDesign';
import EventSource from 'react-native-sse'

const index = () => {

    const [input, setInput] = useState('')
    const { image } = useLocalSearchParams();

    //@ts-ignore
    const [loaded, setLoaded] = useState({
        product1: false,
        product2: false,
        product3: false,
        product4: false
    })

    const [messages, setMessages] = useState<string[]>([]); // State to store incoming messages
    const [posterImages, setPosterImages] = useState<string[]>([]); // State to store incoming images

    const [currentMessage, setCurrentMessage] = useState(''); // Message being typed
    const [typing, setTyping] = useState(false); // Typing state
    const hasTyped = useRef(false); // Ref to track if the typing effect has already run
    /*
    useEffect(() => {
      if (hasTyped.current) return; // Prevent re-execution if already typed
  
      const simulateIncomingMessage = () => {
        setTyping(true); // Start typing effect
        const message = 'This is a simulated typing effect!'; // Example message
        let index = -1;
  
        const interval = setInterval(() => {
          if (index < message.length) {
            setCurrentMessage((prev) => prev ? prev + message[index] : message[index]); // Add one character at a time
            index++;
          } else {
            clearInterval(interval); // Stop the interval when the message is complete
            
            setTyping(false); // Stop typing effect
            hasTyped.current = true; // Mark as typed
          }
        }, 100); // Adjust typing speed (100ms per character)
      };
  
      // Simulate a delay before receiving the message
      const timeout = setTimeout(simulateIncomingMessage, 10);
  
      return () => {
        clearTimeout(timeout); // Cleanup timeout
      };
    }, [messages]);
    */

  useEffect(() => {
    // Initialize the EventSource connection
    console.log('works beginning')
    const eventSource = new EventSource('https://b944-192-35-49-87.ngrok-free.app/sse');

    // Listen for messages from the server
    eventSource.addEventListener('message', (event) => {
      console.log('Message received:', event);
      //@ts-ignore
      try {
        const parsedData = JSON.parse(event.data); // Parse the JSON data
        if (parsedData.image_b64) {
          // Decode the Base64 image and add it to the state
          setPosterImages((prevImages) => [...prevImages, `data:image/png;base64,${parsedData.image_b64}`]);
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
      });
    

    // Handle connection errors
    eventSource.addEventListener('error', (error) => {
      console.error('SSE error:', error);
      eventSource.close(); // Close the connection on error
    });

    // Clean up the connection when the component unmounts
    return () => {
      eventSource.close();
    };
  }, []);


  return (
    <ScrollView className="flex-1"
    showsVerticalScrollIndicator={true}
      contentContainerStyle={{
        minHeight: '100%',
        paddingBottom: 20,
      }}
    >
    <View className='flex-1 mx-8 mt-12 flex-col'>

      <Text className='mb-8 font-interBold text-3xl text-zinc-800'>Choose Design</Text>

        <View className='flex-row justify-end'>
            {/* @ts-ignore */}
            {//<Image source={{uri: image}} resizeMethod='cover' className='absolute right-0 h-56 w-56 rounded-xl'/>
            }
            <View className='border border-black h-56 w-56 rounded-xl'></View>
        </View>

        <View className='bg-zinc-300 py-6 px-4 mr-8 w-11/2 mt-6 rounded-xl'>
            <Text className='text-black'>t</Text>
            
            {posterImages[0] ? (
                <View className='h-44 w-full flex items-center justify-center mt-4 rounded-xl'>
                <Image source={{uri: posterImages[0]}} resizeMode='cover'/>
                </View>
            ) : <View className='h-44 w-full flex items-center justify-center animate-pulse bg-[#141414cc] mt-4 rounded-xl'>
                    <AntDesign name="loading1" size={48} color="black"  className='font-3xl animate-spin'/>
                </View>}
            {posterImages[1] ? (
                <View className='h-44 w-full flex items-center justify-center mt-4 rounded-xl'>
                <Image source={{uri: posterImages[1]}} resizeMode='cover'/>
                </View>
            ) : <View className='h-44 w-full flex items-center justify-center animate-pulse bg-[#141414cc] mt-4 rounded-xl'>
            <AntDesign name="loading1" size={48} color="black"  className='font-3xl animate-spin'/>
        </View>}
            {posterImages[2] ? (
               <View className='h-44 w-full flex items-center justify-center mt-4 rounded-xl'>
               <Image source={{uri: posterImages[2]}} resizeMode='cover'/>
               </View>
            ) : <View className='h-44 w-full flex items-center justify-center animate-pulse bg-[#141414cc] mt-4 rounded-xl'>
            <AntDesign name="loading1" size={48} color="black"  className='font-3xl animate-spin'/>
        </View>}
            {loaded.product4 ? (
                null
            ) : <View className='h-44 w-full flex items-center justify-center animate-pulse bg-[#141414cc] mt-4 rounded-xl'>
            <AntDesign name="loading1" size={48} color="black"  className='font-3xl animate-spin'/>
        </View>}
        
        </View>

        {/*<View className='absolute inset-x-0 bottom-10 h-16 w-full border border-zinc-300 rounded-full bg-zinc-200 flex justify-center items-center'>
            <TextInput
            className="flex-1 text-center text-black"
            placeholder="Type your message..."
            value={input}
            onChangeText={(text) => setInput(text)} // Update state on text change
            placeholderTextColor="#888"
            />
        </View>*/}
    </View>
    </ScrollView>
  )
}

export default index