class CommentsController < ApplicationController
  def create
    @forum = Forum.find_by_sid(params[:sid])
    if(@forum)
      @post = @forum.posts.find_by_id(params[:id])
      if(@post)
        @comment = @post.comments.build(params[:comment])
        if(@comment.save)
          flash[:success]="Comment posted"
        else
          flash[:error]="Something went wrong: #{@comment.errors}"
        end
      else
        #error
        flash[:error]="Invalid post"
      end
      if(params[:redirect])
        redirect_to params[:redirect]
      else
        redirect_to forum_path(@forum.sid)
      end
    else
      flash[:error]="Invalid forum"
      redirect_to root_path
    end
  end

end
