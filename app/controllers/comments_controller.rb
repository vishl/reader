class CommentsController < ApplicationController
  def create
    has_error=false
    message = ""
    @forum = Forum.find_by_sid(params[:forum_id])
    if(@forum)
      @post = @forum.posts.find_by_id(params[:post_id])
      if(@post)
        @comment = @post.comments.build(params.slice(:name, :content))
        if(@comment.save)
          message="Comment posted"
        else
          has_error=true
          message="Something went wrong: #{@comment.errors}"
        end
      else
        #error
        has_error = true
        message="Invalid post"
      end

    else
      has_error=true
      message="Invalid forum"
      #redirect_to root_path
    end

    respond_to do |format|
      format.html do
        #DEFUNCT
        if(message.present?)
          flash[has_error ? :error : :success] = message
        end
        if(params[:redirect])
          redirect_to params[:redirect]
        else
          redirect_to forum_path(@forum.sid)
        end
      end
      format.json do
        render :json=>{'has_error'=>has_error, 'message'=>message, 'comment'=>@comment}
      end
    end

  end

end
