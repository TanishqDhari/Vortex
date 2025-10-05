// 'use client';

// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Play, Plus } from "lucide-react";

// // Define the shape of the data the modal will receive
// interface MediaData {
//   id: number;
//   title: string;
//   year: number;
//   image: string;
//   certification?: string;
//   duration?: string;
//   description?: string;
// }

// interface MediaPreviewModalProps {
//   media: MediaData | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function MediaPreviewModal({ media, isOpen, onClose }: MediaPreviewModalProps) {
//   if (!media) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-3xl p-0 border-0 bg-card/80 backdrop-blur-xl">
//         <div className="flex flex-col md:flex-row">
//           {/* Left Side: Image */}
//           <div className="w-full md:w-1/3 aspect-[2/3] flex-shrink-0">
//             <img src={media.image} alt={media.title} className="w-full h-full object-cover" />
//           </div>

//           {/* Right Side: Details */}
//           <div className="flex flex-col p-6 md:p-8 space-y-4">
//             <h2 className="text-2xl md:text-3xl font-bold text-white">{media.title}</h2>
            
//             <div className="flex items-center gap-2">
//               <Button size="sm" className="h-9 flex-1 bg-white text-black hover:bg-white/90">
//                 <Play className="mr-2 h-4 w-4 fill-black" />
//                 Watch Now
//               </Button>
//               <Button size="icon" variant="secondary" className="h-9 w-9 bg-neutral-700/80 hover:bg-neutral-600/80 border-0">
//                 <Plus className="h-5 w-5" />
//               </Button>
//             </div>

//             <div className="flex items-center gap-2 text-sm text-neutral-400">
//               <span>{media.year}</span>
//               <span className="font-bold border px-1.5 py-0.5 rounded-sm border-neutral-500">{media.certification}</span>
//               <span>{media.duration}</span>
//             </div>

//             <p className="text-sm text-neutral-300 leading-relaxed">
//               {media.description}
//             </p>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }