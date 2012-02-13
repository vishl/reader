class ForumsController < ApplicationController
  include ForumsHelper

  #create a new forum
  def spawn
    forum = Forum.new(params[:forum])
    forum.sid = generate_sid
    if(forum.save)
      redirect_to forum_path(forum.sid)
    else
      flash[:error] = "There was a problem"
      redirect_to root_path
    end
  end

  def create
    has_error = true
    error = ""
    forum = Forum.new params
    forum.sid = generate_sid
    if(forum.save)
      has_error = false
    else
      has_error = true
      error = forum.errors.to_s
    end
    render :json=>{'has_error'=>has_error, 'error'=>error, 'forum'=>forum.attributes.slice('title', 'sid')}
  end

  def show
    has_error = false
    error = ""
    @forum = Forum.find_by_sid(params[:id])
    @post = @forum.posts.build(params[:post])
    @showcomments = params[:showcomments].present?
    if(@forum)
      if(@showcomments)
        #shows only posts with comments and joins on comments
        #this only works in sql lite.. something about needing to aggregate all the columns..piece of shit..
        #@posts = @forum.posts.joins("JOIN comments ON comments.post_id=posts.id").order("comments.created_at DESC").group("posts.id").limit(20).includes(:comments)
        np = @forum.posts.joins("JOIN comments ON comments.post_id=posts.id").order("comments.created_at DESC").limit(50).includes(:comments)
        #have to do this bullshit to get unique posts
        ids={}
        @posts=[]
        np.each do |p|
          if(!ids.include?(p.id))
            ids[p.id]=true
            @posts.push(p)
            if(@posts.length>20)
              break
            end
          end
        end
      else
        @posts = @forum.posts.order("updated_at DESC").limit(20).includes(:comments)
      end
      @latest_post_id = @forum.posts.latest.first.id if @forum.posts.count>0
      @latest_comment_id = @forum.comments.latest.first.id if @forum.comments.count>0
    else
      has_error=true
      error="Forum not found"
      respond_to do |format|
        format.html do 
          redirect_to root_path
          flash[:error] = "Forum not found"
        end
      end
    end

    respond_to do |format|
      format.json do
        if(has_error)
          render :json=>{'has_error'=>has_error, 'error'=>error}
        else
          render :json=>{'forum'=>@forum.attributes.slice('title', 'sid').merge({'id'=>@forum.sid}), 'posts'=>@posts}
        end
      end
    end
  end

  def post
    @forum = Forum.find_by_sid(params[:sid])
    @post = @forum.posts.build(params[:post])
    if(@forum)
    else
      flash[:error] = "Forum not found"
      redirect_to root_path
    end
  end

  def latest
    @forum = Forum.find_by_sid(params[:sid])
    if(@forum)
      latest_post = params[:latest_post].to_i
      latest_comment = params[:latest_comment].to_i
      if((@forum.posts.count>0)    && (latest_post != @forum.posts.latest.first.id) ||
         (@forum.comments.count>0) && (latest_comment != @forum.comments.latest.first.id)
        )
        render :json=>{"has_error"=>false, "out_of_date"=>true}
      else
        render :json=>{"has_error"=>false, "out_of_date"=>false}
      end
    else
        render :json=>{"has_error"=>true}
    end
  end

  def postframe
    @forum=Forum.find_by_sid(params[:sid])
    @post = @forum.posts.find(params[:id])
    @content = params[:content]

    render :layout=>false
  end

  def commentview
    @forum=Forum.find_by_sid(params[:sid])
    @post = @forum.posts.find(params[:id])
    @content = params[:content]

    render :layout=>false
  end

end
