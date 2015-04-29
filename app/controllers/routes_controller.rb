class RoutesController < ApplicationController  
  def index 
    array = [];
    Route.all.each do |route|
      array << route
      puts "HUEHUEHEU #{array}"
    end

    render json: array
  end

  # POST /votes
  # POST /votes.json
  
  # take from snacks2u
  def create
    # @route = Route.new(params[:route])
    
    waypoints = params[:waypoints]
    creator = params[:creator]
    updated_at = params[:updated_at]
    name = params[:name]

    @route = Route.new(waypoints: waypoints, creator: creator, updated_at: updated_at, name: name)
    
    @route.save

    render json: @route

  #   @vote_creator = VoteCreator.new(vote_params)
  #   @vote = @vote_creator.vote
  #   if @vote_creator.save
  #     render json: @vote, status: :created, location: @vote
  #   else
  #     render json: @vote.errors, status: :unprocessable_entity
  #   end
  end

  def show 
    @route = Route.find(params[:id])
    render json: @route
  end


  private

    def route_params
      params.require(:route).permit(:waypoints, :creator, :updated_at)
    end

end
