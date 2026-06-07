import React, { useEffect, useState } from 'react';
import { Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from '@/components/shared/QuickViewModal';

import ZipRequiredModal from '../shared/ZipRequiredModal';

import {
  getSavedSelectedLocation,
  getLocalizedPrice,
} from '../../lib/locationEngine';

const GRADE_LABELS = {
  AS_IS: 'As-Is',
  WWT: 'Wind & Water Tight',
  CW: 'Cargo Worthy',
  IICL: 'IICL Certified',
};

export default function InventoryListCard({
  container,
  index,
}) {
  const navigate = useNavigate();

  const [showModal, setShowModal] =
    useState(false);

  const [showZipModal, setShowZipModal] =
    useState(false);

  const [
    savedLocation,
    setSavedLocation,
  ] = useState(
    getSavedSelectedLocation()
  );

  useEffect(() => {
    const sync = () =>
      setSavedLocation(
        getSavedSelectedLocation()
      );

    window.addEventListener(
      'ce-location-change',
      sync
    );

    window.addEventListener(
      'storage',
      sync
    );

    window.addEventListener(
      'focus',
      sync
    );

    window.addEventListener(
      'pageshow',
      sync
    );

    return () => {
      window.removeEventListener(
        'ce-location-change',
        sync
      );

      window.removeEventListener(
        'storage',
        sync
      );

      window.removeEventListener(
        'focus',
        sync
      );

      window.removeEventListener(
        'pageshow',
        sync
      );
    };
  }, []);

  const hasZip =
    Boolean(
      savedLocation?.postalCode
    );

  const price =
    getLocalizedPrice(
      container.base_price ||
      container.price ||
      0,
      savedLocation
    );

  const openProduct =
    () => {
      if (!hasZip) {
        setShowZipModal(true);
        return;
      }

      navigate(
        `/product/${container.id}`
      );
    };

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay:
            index *
            0.05,
        }}
        onClick={
          openProduct
        }
        className="
          bg-card
          rounded-[26px]
          overflow-hidden
          border
          border-border
          hover:border-primary/20
          cursor-pointer
        "
      >
        <div
          className="
            flex
            flex-col
            md:flex-row
          "
        >
          <img
            src={
              container.image_url
            }
            alt={
              container.name
            }
            className="
              md:w-[36%]
              h-[280px]
              object-cover
            "
          />

          <div className="flex-1 p-6">
            <h3 className="text-2xl font-black">
              {
                container.name
              }
            </h3>

            <p className="text-muted-foreground mt-1">
              {
                container.short_description
              }
            </p>

            <div className="flex items-center gap-2 mt-4">
              <span className="font-bold">
                {(
                  container.rating ||
                  4.8
                ).toFixed(
                  1
                )}
              </span>

              {[
                1,
                2,
                3,
                4,
                5,
              ].map(
                (
                  i
                ) => (
                  <Star
                    key={
                      i
                    }
                    className="
                    w-4
                    h-4
                    fill-yellow-400
                    text-yellow-400
                  "
                  />
                )
              )}

              <span className="text-muted-foreground">
                (
                {
                  container.review_count
                }
                )
              </span>
            </div>

            {!hasZip && (
              <div
                className="
                  mt-6
                  text-[12px]
                  font-black
                  uppercase
                  text-green-500
                "
              >
                STARTING FROM
              </div>
            )}

            <div
              className="
                text-[56px]
                font-black
                text-primary
                leading-none
                mt-2
              "
            >
              $
              {Number(
                price
              ).toLocaleString()}
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                onClick={(
                  e
                ) => {
                  e.stopPropagation();

                  setShowModal(
                    true
                  );
                }}
              >
                <Eye
                  className="mr-2"
                />

                Quick
                View
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <QuickViewModal
        open={
          showModal
        }
        onClose={() =>
          setShowModal(
            false
          )
        }
        container={
          container
        }
      />

      <ZipRequiredModal
        open={
          showZipModal
        }
        onClose={() =>
          setShowZipModal(
            false
          )
        }
        onSuccess={() => {
          setShowZipModal(
            false
          );

          navigate(
            `/product/${container.id}`
          );
        }}
      />
    </>
  );
}
