CAAT.Module({


    /**
     * @name BoneActor
     * @memberof CAAT.Module.Skeleton
     * @constructor
     */

    defines : "CAAT.Skeleton.BoneActor",
    extendsWith : function() {
        return {

            /**
             * @lends CAAT.Module.Skeleton.BoneActor.prototype
             */

            bone    : null,
            skinInfo : null,
            skinInfoByName : null,
            currentSkinInfo : null,
            skinDataKeyframes : null,
            parent : null,
            worldModelViewMatrix : null,

            AABB : null,

            __init : function() {
                this.skinInfo= [];
                this.worldModelViewMatrix= new CAAT.Math.Matrix();
                this.skinInfoByName= {};
                this.skinDataKeyframes= [];
                this.AABB= new CAAT.Math.Rectangle();
            },

            setBone : function(bone) {
                this.bone= bone;
                return this;
            },

            addSkinInfo : function( si ) {
                if (null===this.currentSkinInfo) {
                    this.currentSkinInfo= si;
                }
                this.skinInfo.push( si );
                this.skinInfoByName[ si.name ]= si;
                return this;
            },

            setDefaultSkinInfoByName : function( name ) {
                var v= this.skinInfoByName[name];
                if (v) {
                    this.currentSkinInfo= v;
                }

                return this;
            },

            emptySkinDataKeyframe : function() {
                this.skinDataKeyframes= [];
            },

            addSkinDataKeyframe : function( name, start, duration ) {
                this.skinDataKeyframes.push( {
                    name : name,
                    start : start,
                    duration : duration
                });
            },

            __getCurrentSkinInfo : function(time) {
                if ( this.skinDataKeyframes.length ) {
                    time=(time%1000)/1000;

                    for( var i=0, l=this.skinDataKeyframes.length; i<l; i+=1 ) {
                        var sdkf= this.skinDataKeyframes[i];
                        if ( time>=sdkf.start && time<=sdkf.start+sdkf.duration ) {
                            return this.currentSkinInfo= this.skinInfoByName[ sdkf.name ];
                        }
                    }

                    return null;
                }

                return this.currentSkinInfo;
            },

            paint : function( ctx, time ) {

                var skinInfo= this.__getCurrentSkinInfo(time);

                if (!skinInfo || !skinInfo.image) {
                    return;
                }

                /*
                    var w= skinInfo.width*.5;
                    var h= skinInfo.height*.5;

                    ctx.translate(skinInfo.x, skinInfo.y );
                    ctx.rotate(skinInfo.angle);
                    ctx.scale(skinInfo.scaleX, skinInfo.scaleY);
                    ctx.translate( -w, -h);
                */

                this.worldModelViewMatrix.transformRenderingContextSet(ctx);
                skinInfo.matrix.transformRenderingContext( ctx );
                ctx.drawImage( skinInfo.image, 0, 0, skinInfo.image.width, skinInfo.image.height );

            },

            setupAnimation : function(time) {
                this.setModelViewMatrix();
                this.prepareAABB(time);
            },

            prepareAABB : function(time) {
                var skinInfo= this.__getCurrentSkinInfo(time);
                var x=0, y=0, w, h;

                if ( skinInfo ) {
                    w= skinInfo.width;
                    h= skinInfo.height;
                } else {
                    w= h= 1;
                }

                var vv= [
                    new CAAT.Math.Point(x,y),
                    new CAAT.Math.Point(x+w,0),
                    new CAAT.Math.Point(x+w, y+h),
                    new CAAT.Math.Point(x, y + h)
                ];

                var AABB= this.AABB;
                var vvv;

                var m= new CAAT.Math.Matrix();
                m.copy( this.worldModelViewMatrix );
                m.multiply( this.currentSkinInfo.matrix );

                for( var i=0; i<vv.length; i++ ) {
                    vv[i]= m.transformCoord(vv[i]);
                }


                var xmin = Number.MAX_VALUE, xmax = -Number.MAX_VALUE;
                var ymin = Number.MAX_VALUE, ymax = -Number.MAX_VALUE;

                vvv = vv[0];
                if (vvv.x < xmin) {
                    xmin = vvv.x;
                }
                if (vvv.x > xmax) {
                    xmax = vvv.x;
                }
                if (vvv.y < ymin) {
                    ymin = vvv.y;
                }
                if (vvv.y > ymax) {
                    ymax = vvv.y;
                }
                vvv = vv[1];
                if (vvv.x < xmin) {
                    xmin = vvv.x;
                }
                if (vvv.x > xmax) {
                    xmax = vvv.x;
                }
                if (vvv.y < ymin) {
                    ymin = vvv.y;
                }
                if (vvv.y > ymax) {
                    ymax = vvv.y;
                }
                vvv = vv[2];
                if (vvv.x < xmin) {
                    xmin = vvv.x;
                }
                if (vvv.x > xmax) {
                    xmax = vvv.x;
                }
                if (vvv.y < ymin) {
                    ymin = vvv.y;
                }
                if (vvv.y > ymax) {
                    ymax = vvv.y;
                }
                vvv = vv[3];
                if (vvv.x < xmin) {
                    xmin = vvv.x;
                }
                if (vvv.x > xmax) {
                    xmax = vvv.x;
                }
                if (vvv.y < ymin) {
                    ymin = vvv.y;
                }
                if (vvv.y > ymax) {
                    ymax = vvv.y;
                }

                AABB.x = xmin;
                AABB.y = ymin;
                AABB.x1 = xmax;
                AABB.y1 = ymax;
                AABB.width = (xmax - xmin);
                AABB.height = (ymax - ymin);
            },

            setModelViewMatrix : function() {

                if (this.parent) {
                    this.worldModelViewMatrix.copy(this.parent.worldModelViewMatrix);
                    this.worldModelViewMatrix.multiply(this.bone.wmatrix);

                } else {
                    this.worldModelViewMatrix.identity();
                }

            }
        }
    }
});