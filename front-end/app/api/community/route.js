export async function POST(req) {
  try {
    await connectDB();
    const { userContent, image, imageName } = await req.json();

    // must have at least text or image
    if (!userContent?.trim() && !image) {
      return NextResponse.json({ error: "Content or image required" }, { status: 400 });
    }

    const { getServerSession } = await import("next-auth");
    const { authOptions }      = await import("@/app/api/auth/[...nextauth]/route");
    const session              = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const post = await Post.create({
      userEmail:   session.user.email,
      userName:    session.user.username || session.user.name,
      userContent: userContent?.trim() || "",
      image:       image   || null,
      imageName:   imageName || null,
      likes:       0,
      likedBy:     [],
      comments:    [],
    });

    return NextResponse.json({ post });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}