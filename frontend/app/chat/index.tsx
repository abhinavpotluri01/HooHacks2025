import { View, Text, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useLocalSearchParams } from 'expo-router' // For retrieving navigation parameters
import AntDesign from '@expo/vector-icons/AntDesign';
import EventSource from 'react-native-sse'
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Markdown from 'react-native-markdown-display';

const index = () => {
    const router = useRouter()
    const { image } = useLocalSearchParams() || {};
    const [outfitDescription, setOutfitDescription] = useState<string | null>(null);
    const [shoeImages, setShoeImages] = useState<string[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    // Create a ref to store the eventSource connection for closing it later
    const eventSourceRef = useRef<EventSource | null>(null);
    // Create a ref to track the number of received images
    const imageCountRef = useRef<number>(0);

    const [currentMessage, setCurrentMessage] = useState(''); // Message being typed
    const [typing, setTyping] = useState(false); // Typing state
    const hasTyped = useRef(false); // Ref to track if the typing effect has already run
    
    useEffect(() => {
      if (hasTyped.current) return; // Prevent re-execution if already typed

      if(!outfitDescription) return;
  
      const simulateIncomingMessage = () => {
        setTyping(true); // Start typing effect
        const message = outfitDescription; // Example message
        let index = -1;
  
        const interval = setInterval(() => {
          if (index < message.length -1) {
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
      const timeout = setTimeout(simulateIncomingMessage, 2);
  
      return () => {
        clearTimeout(timeout); // Cleanup timeout
      };
    }, [outfitDescription]);

  useEffect(() => {
    if (!image) {
      addLog('No "image" param provided to this screen.');
      return;
    }

    (async () => {
      try {
        // (A) Convert the local file URI into base64 if needed (still used for /get-outfit-description)
        let base64Data = image as string;
        if (base64Data.startsWith('file://')) {
          addLog(`[INFO] Reading local file at ${base64Data} as base64...`);
          base64Data = await FileSystem.readAsStringAsync(base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });
          addLog('[INFO] Done reading file -> base64!');
        }

        // (B) Post this base64 to /get-outfit-description
        const descUrl = `${process.env.EXPO_PUBLIC_API_URL}/get-outfit-description`;  // or your server IP
        addLog(`[NETWORK] POST => ${descUrl}`);
        const descResp = await fetch(descUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_b64: base64Data }),
        });

        if (!descResp.ok) {
          const errText = await descResp.text();
          throw new Error(`get-outfit-description failed: ${descResp.status} => ${errText}`);
        }

        const descJson = await descResp.json();
        setOutfitDescription(descJson.outfit_description);
        addLog(`[SUCCESS] Outfit description: ${descJson.outfit_description}`);

        // (C) Open SSE connection to /generate-shoes
        const generateUrl = `${process.env.EXPO_PUBLIC_API_URL}/generate-shoes`; // or your server IP
        addLog(`[SSE] Connecting to ${generateUrl}...`);
        console.log('------- ajkshdfjasdhjaks')
        const eventSource = new EventSource(generateUrl, {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({ outfit_description: descJson.outfit_description }),
        });
        
        // Store the eventSource in the ref for later access
        eventSourceRef.current = eventSource;

        // SSE "open" event
        eventSource.addEventListener('open', event => {
          addLog('[SSE] Connection opened!');
          if (imageCountRef.current >= 4) {
            addLog('[SSE] Reached 5 images, closing connection...');
            closeEventSource();
          }
        });

        // SSE "error" event
        eventSource.addEventListener('error', event => {
          addLog(`[SSE] Error => ${JSON.stringify(event)}`);
          closeEventSource();
        });

        // SSE default "message" event
        eventSource.addEventListener('message', event => {
          addLog(`[SSE] (default) => ${event.data}`);
        });

        // SSE named "new_valid_image" event
        eventSource.addEventListener('new_valid_image', (event: any) => {
          addLog(`[SSE] new_valid_image => ${event.data}`);
          
          try {
            const info = JSON.parse(event.data);
            const { seed, shoe_text, image_url } = info;
            addLog(`Received shoe (seed=${seed}): ${shoe_text}`);

            // Check if we already have 5 images using the ref
            if (imageCountRef.current < 4) {
              // Increment the counter first
              imageCountRef.current += 1;
              
              // Add the new image to state
              setShoeImages(prev => [...prev, image_url]);
              
              // If we've reached 5 images, close the connection
              if (imageCountRef.current >= 4) {
                addLog('[SSE] Reached 5 images, closing connection...');
                closeEventSource();
              }
            } else {
              // We already have 5 images, make sure connection is closed
              closeEventSource();
            }
          } catch (parseErr) {
            addLog(`[SSE] Error parsing JSON: ${String(parseErr)}`);
          }
        });
      } catch (err: any) {
        addLog(`[ERROR] ${err.message}`);
        Alert.alert('Error', err.message);
      }
    })();

    // Cleanup on unmount
    return () => {
      closeEventSource();
    };
  }, [image]);

  // Function to safely close the EventSource connection
  const closeEventSource = () => {
    if (eventSourceRef.current) {
      addLog('[SSE] Closing connection...');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  function addLog(msg: string) {
    setLogs(prev => [...prev, msg]);
    console.log(msg);
  }



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
            <Image source={{uri: image}} resizeMethod='cover' className='flex justify-end h-56 w-56 rounded-xl'/>
            
        </View>

        <View className='bg-zinc-300 py-6 px-4 mr-8 w-11/2 mt-6 rounded-xl'>
        <Text className='font-interBold text-2xl mb-4'>CHAT, LET ME COOK</Text>
        <Markdown
            style={{
              body: { color: 'black', fontFamily: 'Inter-SemiBold' },
              heading1: { fontSize: 24, fontWeight: 'bold' },
              link: { color: 'blue' },
              
            }}
            
          >
            {currentMessage}
          </Markdown>
            
            {shoeImages[0] ? (
                
                <TouchableOpacity className='h-44 w-full flex items-center justify-center mt-4 rounded-xl' onPress={() => router.push({ pathname: '/chat/generated', params: { image: shoeImages[0] }})}>
                <Image source={{uri: shoeImages[0]}} style={{ width: '100%', height: '100%', borderRadius: 8, backgroundColor: '#eee' }} resizeMode='contain'/>
                </TouchableOpacity>

            ) : <View className='h-44 w-full flex items-center justify-center animate-pulse bg-[#141414cc] mt-4 rounded-xl'>
                    <AntDesign name="loading1" size={48} color="black"  className='font-3xl animate-spin'/>
                </View>}
            {shoeImages[1] ? (
                <TouchableOpacity className='h-44 w-full flex items-center justify-center mt-4 rounded-xl' onPress={() => router.push({ pathname: '/chat/generated', params: { image: shoeImages[1] }})}>
                <Image source={{uri: shoeImages[1]}} style={{ width: '100%', height: '100%', borderRadius: 8, backgroundColor: '#eee' }} resizeMode='contain'/>
                </TouchableOpacity>
            ) : (shoeImages[0]) && <View className='h-44 w-full flex items-center justify-center animate-pulse bg-[#141414cc] mt-4 rounded-xl'>
            <AntDesign name="loading1" size={48} color="black"  className='font-3xl animate-spin'/>
        </View>}
            {shoeImages[2] ? (
               <TouchableOpacity className='h-44 w-full flex items-center justify-center mt-4 rounded-xl' onPress={() => router.push({ pathname: '/chat/generated', params: { image: shoeImages[2] }})}>
               <Image source={{uri: shoeImages[2]}} style={{ width: '100%', height: '100%', borderRadius: 8, backgroundColor: '#eee' }} resizeMode='contain'/>
               </TouchableOpacity>
            ) : (shoeImages[1]) && <View className='h-44 w-full flex items-center justify-center animate-pulse bg-[#141414cc] mt-4 rounded-xl'>
            <AntDesign name="loading1" size={48} color="black"  className='font-3xl animate-spin'/>
        </View>}
            {shoeImages[3] ? (
                <TouchableOpacity className='h-44 w-full flex items-center justify-center mt-4 rounded-xl' onPress={() => router.push({ pathname: '/chat/generated', params: { image: shoeImages[3] }})}>
                <Image source={{uri: shoeImages[3]}} style={{ width: '100%', height: '100%', borderRadius: 8, backgroundColor: '#eee' }} resizeMode='contain'/>
                </TouchableOpacity>
            ) : (shoeImages[2]) && <View className='h-44 w-full flex items-center justify-center animate-pulse bg-[#141414cc] mt-4 rounded-xl'>
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