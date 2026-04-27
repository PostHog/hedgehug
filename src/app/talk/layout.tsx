export default function TalkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Bypass the root layout's header/footer/chat by rendering directly
  // The slide viewer is fullscreen and handles its own layout
  return <>{children}</>
}
