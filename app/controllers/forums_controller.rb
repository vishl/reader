#Copyright 2012 Vishal Parikh
#This file is part of Freader.
#Freader is free software: you can redistribute it and/or modify
#it under the terms of the GNU General Public License as published by
#the Free Software Foundation, either version 3 of the License, or
#(at your option) any later version.
#
#Freader is distributed in the hope that it will be useful,
#but WITHOUT ANY WARRANTY; without even the implied warranty of
#MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#GNU General Public License for more details.
#
#You should have received a copy of the GNU General Public License
#along with Freader.  If not, see <http://www.gnu.org/licenses/>.

class ForumsController < ApplicationController
  include ForumsHelper
  before_filter :authenticate, :only=>[:create, :mark_all_read]

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
    forum = Forum.new(params.slice("title"))
    if(!forum.save)
      logger.error("Error creating forum: " + forum.errors.to_s)
      render :json=>forum.errors, :status=>400
    else
      sub = current_user.subscriptions.build(:forum_id=>forum.id)
      sub.status="owner"
      if(!sub.save)
        logger.error("Error creating forum sub: " + sub.errors.to_s)
        render :nothing=>true, :status=>500
      else
        #no errors
        render :json=>{'forum'=>forum.as_json(:current_user=>current_user), 'version'=>GlobalSettings.version}
      end
    end
  end

  def update
    forum = Forum.find_by_sid(params[:id])
    unless(forum.owner.user == current_user)
      render :status=>401, :json=>{'error'=>'permission denied'}
    else
      forum.update_attributes(params.slice("title"))
      render :json=>{'forum'=>forum}
    end
  end

  def show
    has_error = false
    error = ""
    @forum = Forum.find_by_sid(params[:id])
    @post = @forum.posts.build(params[:post]) #defunct
    @showcomments = params[:showcomments].present?
    @prefetch = params[:prefetch] == "true"
    if(@forum)
#      if(@showcomments)#sort by comments
#        #shows only posts with comments and joins on comments
#        #this only works in sql lite.. something about needing to aggregate all the columns..
#        #@posts = @forum.posts.joins("JOIN comments ON comments.post_id=posts.id").order("comments.created_at DESC").group("posts.id").limit(20).includes(:comments)
#        np = @forum.posts.joins("JOIN comments ON comments.post_id=posts.id").order("comments.created_at DESC").limit(50).includes(:comments)
#        #have to do this to get unique posts
#        ids={}
#        @posts=[]
#        np.each do |p|
#          if(!ids.include?(p.id))
#            ids[p.id]=true
#            @posts.push(p)
#            if(@posts.length>20)
#              break
#            end
#          end
#        end
#      else
#        @posts = @forum.posts.order("updated_at DESC").limit(20).includes(:comments)
#      end
    else
      has_error=true
      error="Forum not found"
    end

    respond_to do |format|
      format.json do
        if(has_error)
          render :status=>400, :json=>{'has_error'=>has_error, 'error'=>error}
        else
          attrs = {'forum'=>@forum.as_json(:current_user=>current_user, :include_posts=>@prefetch, :offset=>params[:offset], :limit=>params[:limit], :hide_read=>current_user ? current_user.get_setting("hide_read") : false)}
          attrs['version'] = GlobalSettings.version
          render :json=>attrs
        end
      end
    end
  end

#  def post
#    @forum = Forum.find_by_sid(params[:sid])
#    @post = @forum.posts.build(params[:post])
#    if(@forum)
#    else
#      flash[:error] = "Forum not found"
#      redirect_to root_path
#    end
#  end

#  def latest
#    @forum = Forum.find_by_sid(params[:sid])
#    if(@forum)
#      latest_post = params[:latest_post].to_i
#      latest_comment = params[:latest_comment].to_i
#      if((@forum.posts.count>0)    && (latest_post != @forum.posts.latest.first.id) ||
#         (@forum.comments.count>0) && (latest_comment != @forum.comments.latest.first.id)
#        )
#        render :json=>{"has_error"=>false, "out_of_date"=>true}
#      else
#        render :json=>{"has_error"=>false, "out_of_date"=>false}
#      end
#    else
#        render :json=>{"has_error"=>true}
#    end
#  end

#  def commentview
#    @forum=Forum.find_by_sid(params[:sid])
#    @post = @forum.posts.find(params[:id])
#    @content = params[:content]
#
#    render :layout=>false
#  end

  def users
    @forum=Forum.find_by_sid(params[:forum_id])
    if(!@forum)
      render :json=>{"forum"=>"is invalid"}, :status=>400
    else
      render :json=>@forum.users
    end
  end

  def invite
    @forum=Forum.find_by_sid(params[:forum_id])
    @addresses = JSON.parse(params[:addresses])
    if(!@forum)
      render :json=>{"forum"=>"is invalid"}, :status=>400
    elsif(!current_user || !current_user.subscribed_to?(@forum))
      render :json=>{"authorization"=>["permission denied"]}, :status=>401
    elsif(@addresses.length<=0)
      render :json=>{"addresses"=>["is blank"]}, :status=>400
    else
      logger.debug("Inviting #{@addresses.length} people");
      render :json=>{"addresses"=>""}
      Batch.delay.send_invites(@addresses, current_user, @forum);
    end
  end

  def mark_all_read
    @forum = Forum.find_by_sid(params[:id])
    unless(@forum)
      render :status=>404, :json=>{"forum"=>"is invalid"}
    else
      @forum.mark_all_read(current_user)
      render :json=>{'forum'=>@forum.as_json(:current_user=>current_user, :include_posts=>@prefetch, :hide_read=>current_user ? current_user.get_setting("hide_read") : false)}
    end
  end
end
